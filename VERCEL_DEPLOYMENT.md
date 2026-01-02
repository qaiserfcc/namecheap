# Vercel Deployment Guide

## Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables

```bash
# Database (use a PostgreSQL connection pooler for serverless)
DATABASE_URL="postgresql://user:password@host:5432/dbname?pgbouncer=true&connection_limit=1"

# JWT Secrets
JWT_SECRET="your-secure-jwt-secret-here"
JWT_REFRESH_SECRET="your-secure-refresh-secret-here"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Admin Registration
ADMIN_REGISTRATION_SECRET="your-secure-admin-secret-here"

# App URL (will be auto-set by Vercel)
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

## Database Setup for Serverless

### Option 1: Vercel Postgres (Recommended)
1. Install Vercel Postgres from the Vercel dashboard
2. It automatically sets up connection pooling
3. DATABASE_URL is automatically configured

### Option 2: External PostgreSQL with Connection Pooling
Use a connection pooler like:
- **Supabase** (built-in pooling)
- **Neon** (serverless PostgreSQL)
- **PlanetScale** (MySQL alternative)
- **PgBouncer** (self-hosted)

Important: Add `?pgbouncer=true&connection_limit=1` to your DATABASE_URL

## Deployment Steps

### 1. Install Vercel CLI (optional)
```bash
npm i -g vercel
```

### 2. Deploy via Git (Recommended)
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel auto-detects Next.js
4. Add environment variables
5. Deploy

### 3. Deploy via CLI
```bash
vercel --prod
```

### 4. Run Database Migrations
After first deployment:
```bash
# Option A: Use Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option B: Set up in vercel-build script (already configured)
# Migrations run automatically on each deployment
```

### 5. Seed Database (Optional)
```bash
# Pull production env
vercel env pull .env.production.local

# Run seed
npx prisma db seed
```

## API Routes

All API routes are serverless functions:

### Public APIs
- `GET /api/products` - List all products
- `GET /api/products/[slug]` - Get product by slug
- `GET /api/brands` - List all brands
- `GET /api/brands/[slug]` - Get brand with products
- `POST /api/cart` - Calculate cart totals

### Protected APIs (require JWT)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/checkout` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/products/admin` - Admin: Create/Update products

## Performance Optimizations

### 1. Connection Pooling
Prisma is configured with connection limits for serverless:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Edge Runtime (Optional)
For ultra-fast APIs, convert to Edge Runtime:
```typescript
export const runtime = 'edge';
```

### 3. Caching
- Static pages cached at CDN edge
- API responses use `cache: 'no-store'` for dynamic data
- Add ISR for semi-static pages

## Troubleshooting

### Cold Starts
- First request may be slow (2-3s)
- Keep functions warm with monitoring/ping services

### Database Connection Errors
- Ensure connection pooling is enabled
- Check `connection_limit=1` in DATABASE_URL
- Use Vercel Postgres for zero-config pooling

### Build Failures
- Check Prisma schema is valid
- Ensure all dependencies in package.json
- Verify environment variables are set

## Monitoring

- View logs in Vercel dashboard
- Set up alerts for errors
- Monitor function execution time
- Track database connection usage

## Cost Optimization

1. Use Vercel's Free tier (includes 100GB bandwidth)
2. Enable edge caching where possible
3. Use connection pooling to reduce database costs
4. Consider incremental static regeneration (ISR) for product pages

## Security

- All JWT secrets stored as environment variables
- HTTPS enforced by default on Vercel
- CORS configured in next.config.js
- Rate limiting (add middleware if needed)
