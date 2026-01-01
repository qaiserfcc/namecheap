# Database Environment Configuration Guide

## Overview

This project uses environment-specific database configurations to separate production and development databases:

- **Main Branch**: Uses production database (`neondb`)
- **Dev Branch**: Uses development database (`neondb_dev`)
- **Local Development**: Uses `.env.local` (not committed to Git)

## Environment Files

### `.env.local` (Local Development - Not Committed)
- Used for local development on your machine
- Contains local database credentials
- Ignored by Git via `.gitignore`
- Create this file locally and never commit it

### `.env.development` (Dev Branch)
- Used when `NODE_ENV=development`
- Points to `neondb_dev` database
- Safe to commit to repository
- Used for development branch testing

### `.env.production` (Main Branch)
- Used when `NODE_ENV=production`
- Points to `neondb` database (production data)
- Safe to commit to repository
- Used for main branch and production deployments

### `.env.example` (Template)
- Template file showing all required environment variables
- Used as reference for new setup
- Safe to commit to repository

## Database Setup Instructions

### Prerequisite: Create Development Database

The development branch uses a separate `neondb_dev` database. You need to create this in Neon:

1. **Option A: Create a Separate Neon Branch** (Recommended)
   - Go to Neon Console: https://console.neon.tech
   - Select your project (frosty-fire-92848864)
   - Create a new branch from main named "dev"
   - This automatically creates a separate database for testing
   - Copy the connection string to `.env.development`

2. **Option B: Create a Separate Database in Same Project**
   - Via Neon Console, create a new database named `neondb_dev`
   - Use same connection pooler endpoint
   - Update `.env.development` with the new database name

3. **Option C: Use Same Database for Now**
   - If not set up yet, both `.env.development` and `.env.production` can point to `neondb`
   - Later migrate to separate `neondb_dev` when ready
   - Update the `PGDATABASE` value in `.env.development`

## Running the Application

### Development Environment
```bash
# Start development server with dev database
npm run dev

# Or explicitly set to development
NODE_ENV=development npm run dev

# Production environment on local machine (using production database)
npm run dev:prod
```

### Production Environment
```bash
# Build for production
npm build

# Start production server with production database
NODE_ENV=production npm start

# Or use the convenience script
npm run start:prod
```

## Environment Variables Explained

### Database Connection
- `DATABASE_URL`: Connection string (pooler endpoint for serverless)
- `DATABASE_URL_UNPOOLED`: Direct database connection (for migrations)
- `PGDATABASE`: Database name
- `PGHOST`: Connection pooler endpoint

### Postgres Standard Variables
- `POSTGRES_URL`: Alias for DATABASE_URL (Vercel standard)
- `POSTGRES_DATABASE`: Database name
- `POSTGRES_HOST`: Host endpoint
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_USER`: Database user

### Neon-Specific
- `NEON_PROJECT_ID`: Your Neon project ID

### Security
- `SESSION_SECRET`: Secret key for JWT sessions

## Migration Strategy

### Schema Migrations
When running migrations (e.g., with Prisma or raw SQL):

1. **For Development**: Connect using `DATABASE_URL_UNPOOLED` from `.env.development`
   ```bash
   NODE_ENV=development npx prisma migrate deploy
   ```

2. **For Production**: Connect using `DATABASE_URL_UNPOOLED` from `.env.production`
   ```bash
   NODE_ENV=production npx prisma migrate deploy
   ```

### Data Synchronization
- Development database starts fresh or with test data
- Production database is backed up before major migrations
- Use sample data scripts to populate development database

## Next Steps

1. **Create Neon Development Branch or Database**
   - Follow Option A or B above
   - Copy connection details to `.env.development`

2. **Test Connection**
   ```bash
   NODE_ENV=development npm run dev
   # Check logs for successful database connection
   ```

3. **Seed Development Data** (Optional)
   ```bash
   # Run seed scripts if available
   npm run seed:dev
   ```

4. **Switch to Dev Branch in Git**
   ```bash
   git checkout dev
   # npm run dev will now use .env.development automatically
   ```

5. **Verify Separation**
   - Check that prod and dev databases have separate data
   - Confirm data changes in dev don't affect production

## Troubleshooting

### Database Connection Failed
- Check `.env.local` or appropriate `.env.*` file exists
- Verify DATABASE_URL is correct for your environment
- Ensure Neon database is running and not paused

### Wrong Database Being Used
- Check `NODE_ENV` environment variable:
  ```bash
  echo $NODE_ENV  # Should show 'production' or 'development'
  ```
- Verify correct `.env.*` file is being loaded

### Need to Switch Databases Quickly
```bash
# View current NODE_ENV
echo $NODE_ENV

# Switch to development
NODE_ENV=development npm run dev

# Switch to production
NODE_ENV=production npm run dev
```

## Files Affected by Environment Configuration

- `lib/db.ts` - Database connection with environment detection
- `package.json` - Environment-specific npm scripts
- `.env.local` - Local development (not committed)
- `.env.development` - Dev branch configuration
- `.env.production` - Main branch configuration
- `.env.example` - Configuration template

## Best Practices

1. ✅ Always use `.env.local` for local development
2. ✅ Never commit `.env.local` to Git
3. ✅ Keep `.env.production` secrets secure
4. ✅ Use `NODE_ENV=development` when testing with dev database
5. ✅ Back up production database before major migrations
6. ✅ Test migrations in dev database first
7. ✅ Use connection pooler for serverless queries
8. ✅ Use unpooled connection only for migrations

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Neon Branching](https://neon.tech/docs/introduction/branching)
- [Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
