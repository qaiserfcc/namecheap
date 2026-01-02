# Deployment Guide - Serverless E-commerce Platform

This guide will walk you through deploying your serverless e-commerce platform to various cloud providers.

## Prerequisites

- Git repository with the codebase
- Database (PostgreSQL) - Neon, Supabase, or PlanetScale recommended
- Cloud platform account (Vercel, AWS, or Azure)
- Node.js 18+ installed locally

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the recommended platform for Next.js applications with zero configuration.

### Step 1: Prepare Your Database

**Using Neon (Recommended for Serverless)**

1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host.region.neon.tech/database`)

**Alternative: Supabase**

1. Create account at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection pooling mode for serverless)

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional, can also use web interface)
   ```bash
   npm install -g vercel
   ```

2. **Push code to GitHub**
   ```bash
   git push origin main
   ```

3. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

4. **Set Environment Variables** in Vercel Dashboard:
   ```
   DATABASE_URL=postgresql://your-neon-connection-string
   JWT_SECRET=your-production-secret-min-32-chars
   JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Run Database Migrations**
   
   In your Vercel project settings, add a deploy script or run locally:
   ```bash
   DATABASE_URL="your-production-db-url" npx prisma migrate deploy
   DATABASE_URL="your-production-db-url" npm run prisma:seed
   ```

6. **Redeploy** to apply migrations

### Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test the home page loads
3. Try browsing products at `/products`
4. Test admin login at `/admin` with seeded credentials

---

## Option 2: Deploy to AWS Lambda with Vercel CLI

If you want to deploy to AWS Lambda but use Vercel's platform:

1. Follow Option 1 but select AWS as the deployment target in Vercel settings
2. Vercel will automatically configure AWS Lambda and API Gateway

---

## Option 3: Manual AWS Deployment (Advanced)

### Prerequisites
- AWS Account
- AWS CLI configured
- Serverless Framework or AWS SAM

### Step 1: Prepare Next.js for AWS

1. **Install Serverless Next.js**
   ```bash
   npm install --save-dev serverless-next.js
   ```

2. **Create serverless.yml**
   ```yaml
   service: ecommerce-platform

   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1

   plugins:
     - serverless-next.js

   custom:
     serverless-next.js:
       build:
         cmd: npm run build
   ```

3. **Deploy**
   ```bash
   npx serverless deploy
   ```

### Step 2: Set Up Database

Use Amazon RDS (PostgreSQL) or Amazon Aurora Serverless:

1. Create database instance
2. Configure security groups
3. Get connection string
4. Set environment variables in Lambda

---

## Option 4: Deploy to Azure (Advanced)

### Prerequisites
- Azure Account
- Azure CLI installed

### Step 1: Create Azure Resources

```bash
# Login to Azure
az login

# Create resource group
az group create --name ecommerce-rg --location eastus

# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group ecommerce-rg \
  --name ecommerce-db \
  --location eastus \
  --admin-user adminuser \
  --admin-password YourPassword123! \
  --sku-name Standard_B1ms

# Create database
az postgres flexible-server db create \
  --resource-group ecommerce-rg \
  --server-name ecommerce-db \
  --database-name ecommerce
```

### Step 2: Deploy Next.js to Azure Static Web Apps

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Create static web app
az staticwebapp create \
  --name ecommerce-app \
  --resource-group ecommerce-rg \
  --location eastus

# Deploy
swa deploy
```

---

## Post-Deployment Checklist

### Security
- [ ] Change default JWT secrets to strong random values (min 32 characters)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Review and update admin passwords

### Database
- [ ] Run migrations in production
- [ ] Seed database with initial data
- [ ] Set up automated backups
- [ ] Configure connection pooling

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure application monitoring
- [ ] Set up uptime monitoring
- [ ] Enable logging

### Performance
- [ ] Enable caching headers
- [ ] Configure CDN for static assets
- [ ] Optimize images
- [ ] Test cold start times

### Testing
- [ ] Test all authentication flows
- [ ] Verify RBAC is working
- [ ] Test product creation
- [ ] Test order placement
- [ ] Load testing

---

## Environment Variables Reference

### Required
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=minimum-32-characters-strong-secret-key
JWT_REFRESH_SECRET=different-minimum-32-characters-key
```

### Optional
```env
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

---

## Troubleshooting

### Build Fails
- Check Node.js version (must be 18+)
- Verify all dependencies are installed
- Run `npm run build` locally first

### Database Connection Issues
- Verify DATABASE_URL format
- Check database firewall rules
- Ensure IP whitelist includes your deployment platform
- For serverless: use connection pooling

### Authentication Not Working
- Verify JWT_SECRET is set
- Check that secrets match between builds
- Ensure tokens are being sent in Authorization header

### Static Pages Not Loading
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check build output for errors

---

## Updating Your Deployment

### Code Updates
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically redeploy on push to main branch.

### Database Updates
```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply to production
DATABASE_URL="production-url" npx prisma migrate deploy
```

### Environment Variables
- Update in Vercel Dashboard → Settings → Environment Variables
- Redeploy to apply changes

---

## Scaling Considerations

### Database
- Use connection pooling (Neon has this built-in)
- Consider read replicas for high traffic
- Enable query caching

### Application
- Serverless platforms auto-scale
- Monitor cold start times
- Consider warming functions for critical paths

### CDN
- Use for static assets (images, CSS, JS)
- Configure proper cache headers
- Consider image optimization service

---

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Neon Docs: https://neon.tech/docs

---

## Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Database backed up
- [ ] SSL/HTTPS enabled
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Admin passwords changed
- [ ] Test user journeys
- [ ] Performance tested
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Rollback plan in place

---

**Congratulations!** Your serverless e-commerce platform is now deployed and ready for use! 🎉
