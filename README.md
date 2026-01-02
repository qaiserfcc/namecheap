# Serverless E-commerce Platform - Chiltan Pure

A production-grade, single-brand serverless e-commerce platform built with Next.js, Prisma, and PostgreSQL. Features official vs discounted price comparison, role-based access control, and complete admin/buyer workflows.

## 🚀 Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database (Neon serverless recommended)
- **JWT** - Stateless authentication

### Security
- **bcryptjs** - Password hashing
- **JWT tokens** - Access & refresh token strategy
- **RBAC** - Role-based access control (ADMIN, BUYER)
- **Zod** - Runtime validation

## 📋 Features

### Buyer Features
- ✅ Browse products with pagination and search
- ✅ View detailed product information
- ✅ Compare official vs discounted prices
- ✅ See savings amount and percentage
- ✅ Shopping cart (UI ready)
- ✅ User authentication
- ⏳ Order placement
- ⏳ Order history

### Admin Features
- ✅ Admin authentication
- ✅ Product management dashboard
- ✅ View all products
- ⏳ Create/Edit/Delete products
- ⏳ Order management
- ⏳ Update order status
- ⏳ Analytics dashboard
- ⏳ Feature flag management

### Platform Features
- ✅ Server-side price calculations
- ✅ Serverless-safe Prisma configuration
- ✅ Transaction-safe order creation
- ✅ Stock validation and management
- ✅ Feature flags system
- ✅ Multi-environment support

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended for serverless)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd namecheap
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# JWT Secrets (change these in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Set Up Database

#### Generate Prisma Client
```bash
npm run prisma:generate
```

#### Run Database Migrations
```bash
npx prisma migrate dev --name init
```

#### Seed Database with Sample Data
```bash
npm run prisma:seed
```

This will create:
- 1 Brand (Chiltan Pure)
- 5 Sample Products
- 1 Admin User
- 1 Buyer User
- 4 Feature Flags

### 5. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 🔐 Login Credentials

After seeding the database, use these credentials:

### Admin User
- **Email:** admin@chiltanpure.com
- **Password:** admin123
- **Access:** Full admin dashboard

### Buyer User
- **Email:** buyer@example.com
- **Password:** buyer123
- **Access:** Shopping and orders

## 📁 Project Structure

```
namecheap/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/
│   │   ├── api/               # API routes (serverless)
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product endpoints
│   │   │   ├── orders/        # Order endpoints
│   │   │   └── feature-flags/ # Feature flag endpoints
│   │   ├── admin/             # Admin pages
│   │   ├── products/          # Product pages
│   │   ├── cart/              # Shopping cart
│   │   └── page.tsx           # Home page
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client (serverless-safe)
│   │   ├── auth.ts            # JWT utilities
│   │   ├── pricing.ts         # Price calculation logic
│   │   └── api-response.ts    # API response helpers
│   ├── middleware/
│   │   └── auth.ts            # Auth & RBAC middleware
│   └── types/
│       └── index.ts           # TypeScript types
├── PROGRESS.md                # Implementation progress tracker
└── README.md                  # This file
```

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/products` - List all active products
- `GET /api/products/[slug]` - Get product details
- `GET /api/feature-flags` - Get feature flags
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Authenticated Endpoints
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Admin Only Endpoints
- `GET /api/products/admin` - List all products (including inactive)
- `POST /api/products/admin` - Create new product

## 🗄️ Database Schema

### Core Models
- **Brand** - Brand information
- **Product** - Products with official & discounted prices
- **User** - Users with roles (ADMIN, BUYER)
- **Order** - Customer orders
- **OrderItem** - Order line items
- **FeatureFlag** - Platform feature toggles

### Key Features
- UUID primary keys
- Indexed foreign keys
- Optimistic concurrency with timestamps
- Cascading deletes where appropriate
- Stock tracking

## 💰 Price Comparison

All price calculations are done **server-side only**:

```typescript
interface PriceComparison {
  officialPrice: number;
  discountedPrice: number;
  savings: number;              // officialPrice - discountedPrice
  savingsPercentage: number;    // (savings / officialPrice) * 100
}
```

The frontend **never** calculates prices - all pricing logic is handled by the API.

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Refresh token rotation
- ✅ Role-based access control
- ✅ Protected admin routes
- ✅ Input validation with Zod
- ✅ Serverless-safe database connections
- ✅ No hardcoded secrets

## 🚀 Deployment

### Recommended Platforms
- **Vercel** - Zero configuration deployment
- **AWS Lambda** - With API Gateway
- **Azure Functions** - Serverless functions

### Database
- **Neon** - Serverless PostgreSQL (recommended)
- **Supabase** - PostgreSQL with additional features
- **PlanetScale** - Serverless MySQL alternative

### Environment Setup
1. Set all environment variables in your platform
2. Run `npx prisma migrate deploy` in production
3. Optionally run seed script for demo data

## 📊 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
```

## 🎯 Next Steps

See [PROGRESS.md](./PROGRESS.md) for detailed implementation status and roadmap.

### Immediate Priorities
1. Complete shopping cart functionality
2. Implement checkout flow
3. Add product creation/editing forms
4. Build order management interface
5. Add analytics dashboard

### Future Enhancements
- Multi-brand support
- Advanced search and filtering
- Product reviews and ratings
- Email notifications
- Payment gateway integration
- Inventory alerts
- Discount campaigns
- International shipping

## 📝 License

ISC

## 👨‍💻 Support

For issues and questions, please refer to the project documentation or create an issue in the repository.

---

Built with ❤️ using Next.js, Prisma, and PostgreSQL
