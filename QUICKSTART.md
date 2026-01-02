# Quick Start Guide - Get Running in 5 Minutes

This guide will get your e-commerce platform running locally in just a few steps.

## Prerequisites

- Node.js 18 or higher installed
- Git installed
- A PostgreSQL database (we'll use Neon - free tier available)

## Step 1: Get a Database (2 minutes)

### Option A: Neon (Recommended - Serverless)

1. Go to https://neon.tech and sign up (free)
2. Click "Create Project"
3. Name it "ecommerce" and select a region close to you
4. Click "Create Project"
5. Copy the connection string shown (starts with `postgresql://`)

### Option B: Supabase (Alternative)

1. Go to https://supabase.com and sign up (free)
2. Click "New Project"
3. Fill in project details
4. Wait for database to be ready (~2 minutes)
5. Go to Settings → Database → Connection string
6. Copy the "Connection pooling" string (for serverless)

## Step 2: Clone and Setup (1 minute)

```bash
# Clone the repository
git clone <your-repo-url>
cd namecheap

# Install dependencies
npm install
```

## Step 3: Configure Environment (30 seconds)

Create a `.env` file in the root directory:

```env
# Database - Replace with your connection string from Step 1
DATABASE_URL="postgresql://user:password@host.region.neon.tech/database"

# JWT Secrets - Keep these secret in production!
JWT_SECRET="development-secret-key-min-32-characters-long"
JWT_REFRESH_SECRET="development-refresh-secret-min-32-chars"

# Optional - defaults are fine for development
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Important**: Replace the `DATABASE_URL` with your actual connection string from Step 1.

## Step 4: Initialize Database (1 minute)

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed with sample data (1 brand, 5 products, 2 users)
npm run prisma:seed
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database migrations completed
✔ Seed data created
Admin: admin@chiltanpure.com / admin123
Buyer: buyer@example.com / buyer123
```

## Step 5: Start the Development Server (30 seconds)

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser! 🎉

## What You Can Do Now

### Browse Products (Public)
1. Visit http://localhost:3000
2. Click "Shop Now" or go to http://localhost:3000/products
3. Browse products with official vs discounted pricing
4. Click any product to see detailed price comparison

### Admin Dashboard (Requires Login)
1. Go to http://localhost:3000/admin
2. Login with:
   - Email: `admin@chiltanpure.com`
   - Password: `admin123`
3. View products, orders, and dashboard
4. Click "Products" to see product management

### Buyer Account (Requires Login)
1. Login with:
   - Email: `buyer@example.com`
   - Password: `buyer123`
2. Browse and shop products

## Test the APIs

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Get Single Product
```bash
curl http://localhost:3000/api/products/pure-honey-500g
```

### Login (Get JWT Token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chiltanpure.com",
    "password": "admin123"
  }'
```

### Create Order (Authenticated)
```bash
# First login to get token, then:
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID_FROM_API",
        "quantity": 2
      }
    ],
    "shippingAddress": "123 Main St, City, Country"
  }'
```

## View Database

To explore your database visually:

```bash
npm run prisma:studio
```

This opens Prisma Studio at http://localhost:5555 where you can:
- Browse all data tables
- Edit records
- See relationships
- Add test data

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database
npm run prisma:studio

# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database again
npm run prisma:seed
```

## Troubleshooting

### Database Connection Error
- Check your `DATABASE_URL` in `.env` is correct
- Verify your database is running
- For Neon: check the database isn't paused (free tier auto-pauses)

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use
```bash
# Change port in package.json or run:
PORT=3001 npm run dev
```

### Prisma Generate Fails
```bash
# Make sure DATABASE_URL is set correctly
# Then regenerate:
npx prisma generate
```

## Next Steps

### For Development
1. Read the [README.md](./README.md) for complete documentation
2. Check [PROGRESS.md](./PROGRESS.md) to see what's implemented
3. Review API endpoints in README
4. Explore the codebase structure

### For Deployment
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Choose a platform (Vercel recommended)
3. Set up production database
4. Configure environment variables
5. Deploy!

### Add More Features
Current implementation is production-ready but minimal. You can extend it with:
- Shopping cart functionality (localStorage or backend)
- Complete checkout flow
- Payment gateway integration
- Product image uploads
- Email notifications
- Order tracking
- Product reviews
- Advanced search

## Sample Data Included

After running the seed script, you have:

**Products** (5):
- Pure Honey - 500g (PKR 1500 → PKR 1200)
- Organic Olive Oil - 1L (PKR 2500 → PKR 2000)
- Black Seed Oil - 250ml (PKR 1800 → PKR 1500)
- Himalayan Pink Salt - 1kg (PKR 800 → PKR 650)
- Organic Dates - 500g (PKR 1200 → PKR 950)

**Users** (2):
- Admin: admin@chiltanpure.com / admin123
- Buyer: buyer@example.com / buyer123

**Feature Flags** (4):
- Cash on Delivery (enabled)
- Reviews & Ratings (enabled)
- Promotional Discounts (enabled)
- International Shipping (disabled)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the README.md
3. Check the DEPLOYMENT.md for production issues
4. Verify your environment variables are set correctly

---

**🎉 You're all set!** Visit http://localhost:3000 and start exploring your serverless e-commerce platform!
