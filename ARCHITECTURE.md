# Architecture Documentation

## System Architecture

The Multi-Brand E-commerce Platform follows a **Clean Architecture** pattern with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Next.js Frontend - React)                  │
│  - Brand Storefronts                                     │
│  - Admin Dashboards                                      │
│  - Price Comparison UI                                   │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│               (NestJS Backend - Node.js)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Controllers (API Endpoints)                     │   │
│  │  - AuthController                                │   │
│  │  - BrandsController                              │   │
│  │  - ProductsController                            │   │
│  │  - OrdersController                              │   │
│  │  - UsersController                               │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Services (Business Logic)                       │   │
│  │  - Price Comparison Logic                        │   │
│  │  - Brand Isolation Logic                         │   │
│  │  - Order Transaction Logic                       │   │
│  │  - Authentication Logic                          │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Guards & Middleware                             │   │
│  │  - JWT Authentication                            │   │
│  │  - RBAC Guards                                   │   │
│  │  - Brand Isolation Guards                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓ Prisma ORM
┌─────────────────────────────────────────────────────────┐
│                    Data Access Layer                     │
│                  (Prisma Client)                         │
│  - Type-safe database queries                            │
│  - Automatic migrations                                  │
│  - Connection pooling                                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Persistence Layer                      │
│              (PostgreSQL - Neon)                         │
│  - Brands, Products, Orders                              │
│  - Users, Reviews, Addresses                             │
│  - Multi-tenant data isolation                           │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Backend (NestJS)

**Technology Stack:**
- Framework: NestJS (Node.js)
- Language: TypeScript
- Architecture: Modular, dependency injection
- API: RESTful with OpenAPI 3.0

**Modules:**

1. **Auth Module**
   - JWT token generation and validation
   - Refresh token management
   - Password hashing with bcrypt
   - User registration and login

2. **Brands Module**
   - Brand CRUD operations
   - Feature toggle management
   - Brand-specific metadata
   - SEO configuration

3. **Products Module**
   - Product management
   - **Server-side price comparison**
   - Stock management
   - Brand association enforcement

4. **Orders Module**
   - Checkout process
   - Transaction-based order creation
   - Stock deduction
   - Order status management

5. **Users Module**
   - User management
   - Role assignment
   - Brand association

6. **Common Module**
   - Prisma service
   - Guards (JWT, RBAC, Brand Isolation)
   - Decorators
   - Utilities

### 2. Frontend (Next.js)

**Technology Stack:**
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Rendering: Server-Side Rendering (SSR)

**Page Structure:**

```
/                              # Home page
/brands                        # All brands list
/brands/[slug]                 # Brand storefront
/brands/[slug]/products/[slug] # Product detail
/admin                         # Admin dashboard
/auth/login                    # Login page
/auth/register                 # Registration page
```

**Features:**
- Dynamic routing based on brand slug
- SEO-optimized pages with metadata
- Price comparison display (server-calculated)
- Responsive design
- Admin dashboards

### 3. Database (PostgreSQL)

**Schema Design:**

```
Brand (Multi-tenant root)
  ├─ Products
  ├─ Users (Brand-specific)
  └─ Orders

User
  ├─ Addresses
  ├─ Orders
  └─ Reviews

Order
  ├─ OrderItems
  └─ Address

Product
  └─ Reviews
```

**Key Relationships:**
- One Brand → Many Products
- One Brand → Many Users (Brand Admin, etc.)
- One Brand → Many Orders
- One User → Many Orders
- One Order → Many OrderItems
- One Product → Many OrderItems

## Security Architecture

### 1. Authentication Flow

```
User Login Request
    ↓
Validate Credentials (bcrypt)
    ↓
Generate JWT Access Token (15m)
    ↓
Generate Refresh Token (7d)
    ↓
Hash & Store Refresh Token
    ↓
Return Tokens to Client
```

### 2. Authorization (RBAC)

**Role Hierarchy:**
```
SUPER_ADMIN
  ↓
BRAND_ADMIN (per brand)
  ↓
BRAND_MANAGER (per brand)
  ↓
FINANCE (per brand, read-only)
  ↓
WAREHOUSE (per brand, fulfillment)
  ↓
CUSTOMER (browse all, order)
```

**Access Control Matrix:**

| Role | Brands | Products | Orders | Users |
|------|--------|----------|--------|-------|
| SUPER_ADMIN | Full | Full | Full | Full |
| BRAND_ADMIN | Own Brand | Own Brand | Own Brand | View Own |
| BRAND_MANAGER | View Own | View Own | View Own | View Own |
| FINANCE | View Own | View Own | View Own (RO) | No |
| WAREHOUSE | View Own | View Own | Update Status | No |
| CUSTOMER | View All | View All | Own Orders | Own Profile |

### 3. Brand Isolation

**Enforcement Mechanisms:**

1. **Database Level:**
   - Every query filtered by `brandId`
   - Foreign key constraints

2. **Service Level:**
   - Brand validation in services
   - User brand association check

3. **Guard Level:**
   - `BrandIsolationGuard` on routes
   - Automatic brand ID validation

4. **Query Level:**
   - Prisma `where` clauses
   - Automatic filtering

## Data Flow

### 1. Product Browsing Flow

```
User → Frontend
  ↓
GET /brands/chiltan-pure
  ↓
Backend: BrandsController.findBySlug()
  ↓
BrandsService.findBySlug()
  ↓
Prisma: brand.findUnique({ include: products })
  ↓
Return products with price comparison
  ↓
Frontend displays with savings
```

### 2. Price Comparison Calculation

**Critical Rule: Server-side ONLY**

```typescript
// Backend Service (ONLY place for calculation)
private calculatePriceComparison(product) {
  const savings = officialPrice - discountedPrice;
  const percentage = (savings / officialPrice) * 100;
  
  return {
    ...product,
    priceComparison: {
      savings: Number(savings.toFixed(2)),
      savingsPercentage: Number(percentage.toFixed(2))
    }
  };
}

// Frontend (Display ONLY)
<div>Save PKR {product.priceComparison.savings}</div>
```

### 3. Order Checkout Flow

```
User adds products to cart
  ↓
POST /orders (with items, addressId, brandId)
  ↓
OrdersService.create()
  ↓
Begin Prisma Transaction
  ├─ Validate products & stock
  ├─ Calculate totals (server-side)
  ├─ Create order
  ├─ Create order items
  ├─ Deduct stock
  └─ Commit transaction
      ↓
Return order confirmation
```

## Scalability Considerations

### 1. Horizontal Scaling

**Backend:**
- Stateless API servers
- Multiple instances behind load balancer
- Session stored in JWT (no server state)

**Frontend:**
- Static site generation
- CDN distribution
- Edge caching

**Database:**
- Neon serverless autoscaling
- Connection pooling
- Read replicas (future)

### 2. Performance Optimization

**Backend:**
- Prisma query optimization
- Database indexing on frequently queried fields
- Response caching (future: Redis)
- Compression middleware

**Frontend:**
- Next.js automatic code splitting
- Image optimization
- Static page generation where possible
- Client-side caching

### 3. Monitoring & Observability

**Application Metrics:**
- Request latency
- Error rates
- Throughput

**Database Metrics:**
- Query performance
- Connection pool usage
- Slow query log

**Business Metrics:**
- Orders per brand
- Conversion rates
- Average order value
- Discount effectiveness

## Deployment Architecture

### Development Environment

```
Developer Machine
  ├─ Backend (localhost:3001)
  ├─ Frontend (localhost:3000)
  └─ Neon Dev Database
```

### Production Environment

```
Load Balancer
  ├─ Backend Instance 1
  ├─ Backend Instance 2
  └─ Backend Instance N
      ↓
Neon Production Database (Pooled)

CDN
  ├─ Frontend Static Assets
  └─ Next.js SSR Edge Functions
```

## Security Best Practices

1. **Never expose database credentials** in code
2. **Always use environment variables** for secrets
3. **Hash passwords** with bcrypt (salt rounds: 10)
4. **Use JWT with short expiration** (15 minutes)
5. **Implement refresh token rotation**
6. **Validate all user inputs** (class-validator)
7. **Use HTTPS** in production
8. **Enable CORS** with specific origins
9. **Implement rate limiting** (future)
10. **Regular security audits** (npm audit)

## Testing Strategy

### Unit Tests
- Services business logic
- Price calculation accuracy
- Brand isolation logic

### Integration Tests
- API endpoints
- Database interactions
- Authentication flow

### E2E Tests
- Complete user journeys
- Checkout process
- Admin workflows

## Future Enhancements

1. **Caching Layer** (Redis)
2. **Search** (Elasticsearch)
3. **Real-time Updates** (WebSockets)
4. **Payment Integration** (Stripe, PayPal)
5. **Email Notifications** (SendGrid)
6. **File Uploads** (S3, Cloudinary)
7. **Analytics Dashboard**
8. **Inventory Management**
9. **Loyalty Program**
10. **Multi-language Support**

## Maintenance

### Regular Tasks
- Dependency updates (monthly)
- Database optimization (quarterly)
- Security patches (as needed)
- Performance monitoring (daily)
- Backup verification (weekly)

### Database Migrations
- Use Prisma Migrate for all schema changes
- Test migrations in staging first
- Always have rollback plan
- Document breaking changes

---

**Last Updated**: December 2024
**Version**: 1.0.0
