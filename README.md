# Multi-Brand E-commerce Platform

Production-grade, scalable multi-brand e-commerce platform with strict brand isolation, official vs discounted price comparison, and role-based access control.

## 🎯 Platform Overview

A comprehensive e-commerce platform where:
- **Main portal** lists multiple brands (e.g., Chiltan Pure, Brand X)
- **Dedicated brand storefronts** with isolated features and products
- **Price comparison** enforces official brand pricing vs discounted pricing
- **RBAC** with 6 different user roles for granular access control
- **Enterprise-ready** architecture with clean separation of concerns

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│         /brands → /brand-slug → /product/slug       │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│              Backend API (NestJS)                   │
│   Auth • Brands • Products • Orders • Users         │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│         PostgreSQL (Neon) + Prisma ORM             │
│         Multi-tenant with Brand Isolation           │
└─────────────────────────────────────────────────────┘
```

## ✨ Key Features

### Core Functionality
- ✅ **Multi-brand support** with complete isolation
- ✅ **Server-side price comparison** (Official vs Discounted)
- ✅ **Role-based access control** (6 roles)
- ✅ **JWT + Refresh Token** authentication
- ✅ **Brand-specific feature toggles** (COD, Subscriptions, etc.)
- ✅ **Transaction-based checkout**
- ✅ **SEO optimization** per brand
- ✅ **Clean Architecture** pattern

### Brand Features (Toggleable)
Each brand can independently enable/disable:
- Cash on Delivery (COD)
- Subscriptions
- Loyalty Points
- International Shipping
- Reviews & Ratings

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: JWT + Passport
- **API Docs**: Swagger/OpenAPI v3
- **Validation**: class-validator

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **SSR**: Enabled for SEO
- **Routing**: Brand-based dynamic routes

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Cloud**: Cloud-agnostic (AWS/Azure compatible)

## 📁 Project Structure

```
namecheap/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Seed data
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── auth/              # Authentication
│   │   ├── brands/            # Brand management
│   │   ├── products/          # Products with price comparison
│   │   ├── users/             # User management
│   │   ├── orders/            # Order & checkout
│   │   ├── common/            # Guards, decorators, utilities
│   │   └── main.ts            # App entry
│   └── Dockerfile
├── frontend/                   # Next.js App
│   ├── app/
│   │   ├── brands/            # Brand pages
│   │   ├── admin/             # Admin dashboard
│   │   └── auth/              # Authentication pages
│   ├── components/            # React components
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (Neon) database
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/qaiserfcc/namecheap.git
cd namecheap
```

2. **Setup Backend**
```bash
cd backend
npm install

# Configure environment
cp .env.development .env
# Edit .env with your database URL

# Generate Prisma Client
npm run prisma:generate

# Run migrations (when database is available)
npm run prisma:migrate

# Seed database
npm run db:seed

# Start backend
npm run start:dev
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install

# Start frontend
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Docs: http://localhost:3001/api/docs

### Using Docker

```bash
# Set environment variables
export DATABASE_URL="your-neon-database-url"
export JWT_SECRET="your-secret"
export JWT_REFRESH_SECRET="your-refresh-secret"

# Build and run
docker-compose up --build
```

## 👥 User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| `SUPER_ADMIN` | Platform administrator | Full access to all brands, users, and settings |
| `BRAND_ADMIN` | Brand manager | Manage products, orders, and settings for assigned brand only |
| `BRAND_MANAGER` | Content manager | View and manage content for assigned brand only |
| `CUSTOMER` | End user | Browse products, place orders, view own orders |
| `FINANCE` | Financial officer | Read-only access to transactions for assigned brand |
| `WAREHOUSE` | Fulfillment staff | Manage order fulfillment for assigned brand |

## 🔐 Default Test Accounts

After running the seed script:

| Email | Password | Role |
|-------|----------|------|
| admin@ecommerce.com | Admin@123 | SUPER_ADMIN |
| admin@chiltanpure.com | Admin@123 | BRAND_ADMIN (Chiltan Pure) |
| admin@brandx.com | Admin@123 | BRAND_ADMIN (Brand X) |
| customer@example.com | Admin@123 | CUSTOMER |

## 💰 Price Comparison Feature

All product endpoints return server-side calculated price comparison:

```json
{
  "id": "uuid",
  "name": "Organic Argan Oil",
  "officialPrice": 2500,
  "discountedPrice": 1999,
  "priceComparison": {
    "savings": 501,
    "savingsPercentage": 20.04
  }
}
```

**Critical Rule**: Frontend must NEVER calculate prices. All pricing logic is server-side only.

## 🔒 Brand Isolation

The platform enforces strict brand isolation:
- ✅ API endpoints validate brand ownership
- ✅ Database queries filtered by `brandId`
- ✅ Guards prevent cross-brand data access
- ✅ Brand admins cannot access other brands

## 📊 Database Schema

Key models:
- **Brand**: Multi-brand support with feature toggles
- **Product**: Products with official/discounted pricing
- **User**: Users with RBAC
- **Order**: Orders with transaction support
- **OrderItem**: Line items with price history
- **Address**: User shipping addresses
- **Review**: Product reviews (if enabled)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

### Brands
- `GET /api/brands` - List brands
- `GET /api/brands/:id` - Get brand
- `GET /api/brands/slug/:slug` - Get by slug
- `POST /api/brands` - Create (Super Admin)
- `PATCH /api/brands/:id` - Update
- `DELETE /api/brands/:id` - Delete (Super Admin)

### Products
- `GET /api/products` - List products with price comparison
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create (Brand Admin)
- `PATCH /api/products/:id` - Update
- `DELETE /api/products/:id` - Delete

### Orders
- `POST /api/orders` - Create order (checkout)
- `GET /api/orders` - List orders (filtered by role)
- `GET /api/orders/:id` - Get order
- `PATCH /api/orders/:id/status` - Update status

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚢 Production Deployment

1. Set `NODE_ENV=production`
2. Update database URLs in `.env.production`
3. Run production migrations
4. Build both backend and frontend
5. Deploy using Docker or your preferred method

## 📚 Documentation

- Backend API: http://localhost:3001/api/docs (Swagger)
- Database: Run `npm run prisma:studio` for GUI
- Architecture: See [backend/README.md](backend/README.md)

## 🤝 Contributing

This is a production-grade implementation. No shortcuts or mock logic allowed.

## 📄 License

ISC

## 🙏 Acknowledgments

Built with enterprise-grade standards following the master-copilot-prompt specifications.
