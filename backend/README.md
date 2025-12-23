# Multi-Brand E-commerce Platform - Backend API

Production-grade NestJS backend with Prisma ORM, PostgreSQL (Neon), JWT authentication, and RBAC.

## Features

- ✅ Multi-brand isolation with RBAC
- ✅ JWT + Refresh Token authentication
- ✅ Server-side price comparison (Official vs Discounted)
- ✅ Role-based access control (6 roles)
- ✅ Brand feature toggles
- ✅ Prisma ORM with migrations
- ✅ OpenAPI/Swagger documentation
- ✅ Transaction-based checkout
- ✅ PostgreSQL (Neon database)

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (Neon) database

## Installation

```bash
npm install
```

## Environment Setup

Create `.env` file (copy from `.env.development`):

```env
NODE_ENV=development
DATABASE_URL="your-neon-database-url"
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
```

## Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run db:seed
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Prisma Studio (Database GUI)
npm run prisma:studio
```

The API will be available at:
- **API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs

## Default Users (After Seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@ecommerce.com | Admin@123 | SUPER_ADMIN |
| admin@chiltanpure.com | Admin@123 | BRAND_ADMIN (Chiltan Pure) |
| admin@brandx.com | Admin@123 | BRAND_ADMIN (Brand X) |
| customer@example.com | Admin@123 | CUSTOMER |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Brands
- `GET /api/brands` - List all brands
- `GET /api/brands/:id` - Get brand by ID
- `GET /api/brands/slug/:slug` - Get brand by slug
- `POST /api/brands` - Create brand (Super Admin)
- `PATCH /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand (Super Admin)

### Products
- `GET /api/products` - List all products with price comparison
- `GET /api/products/:id` - Get product with price comparison
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (Brand Admin)
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order (checkout)
- `GET /api/orders` - List orders (filtered by role)
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Users
- `GET /api/users` - List users (Super Admin)
- `GET /api/users/:id` - Get user
- `POST /api/users` - Create user (Super Admin)
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Super Admin)

## User Roles & Permissions

| Role | Permissions |
|------|-------------|
| `SUPER_ADMIN` | Full system access, manage all brands, users, and settings |
| `BRAND_ADMIN` | Manage products, orders, settings for assigned brand only |
| `BRAND_MANAGER` | View and manage content for assigned brand only |
| `CUSTOMER` | Browse products, place orders, view own orders |
| `FINANCE` | Read-only access to transactions for assigned brand |
| `WAREHOUSE` | Manage order fulfillment for assigned brand |

## Brand Isolation

The platform enforces strict brand isolation:
- Brand admins can only access their own brand's data
- API endpoints validate brand ownership
- Database queries are filtered by brandId
- Guards prevent cross-brand data leaks

## Price Comparison

All product endpoints return server-side calculated price comparison:

```json
{
  "id": "...",
  "name": "Organic Argan Oil",
  "officialPrice": 2500,
  "discountedPrice": 1999,
  "priceComparison": {
    "savings": 501,
    "savingsPercentage": 20.04
  }
}
```

**Important**: Frontend must NOT calculate prices. All pricing logic is server-side only.

## Database Schema

See `prisma/schema.prisma` for complete schema.

Key models:
- **Brand**: Multi-brand support with feature toggles
- **Product**: Products with official/discounted pricing
- **User**: Users with role-based access
- **Order**: Orders with transaction support
- **OrderItem**: Line items with price history
- **Address**: User shipping addresses
- **Review**: Product reviews (if enabled for brand)

## Brand Feature Toggles

Each brand can enable/disable:
- Cash on Delivery (COD)
- Subscriptions
- Loyalty Points
- International Shipping
- Reviews & Ratings

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed data
│   └── migrations/        # Database migrations
├── src/
│   ├── auth/              # Authentication module
│   ├── brands/            # Brands module
│   ├── products/          # Products module
│   ├── users/             # Users module
│   ├── orders/            # Orders module
│   ├── common/            # Shared utilities
│   │   ├── prisma/        # Prisma service
│   │   ├── guards/        # Auth & RBAC guards
│   │   └── decorators/    # Custom decorators
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
├── .env.development       # Dev environment
├── .env.production        # Prod environment
└── package.json
```

## Testing

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Update `.env.production` with production database URL
3. Run production migrations: `npm run prisma:migrate:prod`
4. Build: `npm run build`
5. Start: `npm run start:prod`

## Security Features

- ✅ JWT + Refresh tokens
- ✅ Password hashing with bcrypt
- ✅ RBAC guards
- ✅ Brand isolation middleware
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment-based configuration

## License

ISC
