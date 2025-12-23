# Deployment Guide

Complete guide for deploying the Multi-Brand E-commerce Platform to production.

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed (for containerized deployment)
- PostgreSQL (Neon) database access
- Domain name (optional)
- SSL certificate (for production)

## Environment Configuration

### Backend Environment Variables

Create `.env.production` in the `backend/` directory:

```env
NODE_ENV=production
DATABASE_URL="postgresql://neondb_owner:npg_nsTw81MrgcZR@ep-lively-art-ahvle7ag-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET=CHANGE_THIS_TO_A_STRONG_SECRET_KEY
JWT_REFRESH_SECRET=CHANGE_THIS_TO_A_DIFFERENT_STRONG_SECRET_KEY
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
FRONTEND_URL=https://yourdomain.com
```

### Frontend Environment Variables

Create `.env.production` in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Deployment Methods

### Method 1: Docker Compose (Recommended)

1. **Create production docker-compose override**

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    environment:
      - NODE_ENV=production
    restart: always

  frontend:
    environment:
      - NODE_ENV=production
    restart: always
```

2. **Set environment variables**

```bash
export DATABASE_URL="your-production-database-url"
export JWT_SECRET="your-strong-secret"
export JWT_REFRESH_SECRET="your-refresh-secret"
```

3. **Build and deploy**

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

4. **Run migrations**

```bash
docker-compose exec backend npx prisma migrate deploy
```

5. **Seed database (first time only)**

```bash
docker-compose exec backend npm run db:seed
```

### Method 2: Manual Deployment

#### Backend Deployment

```bash
cd backend

# Install dependencies
npm ci --only=production

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:prod

# Seed database (first time only)
npm run db:seed

# Build application
npm run build

# Start production server
npm run start:prod
```

#### Frontend Deployment

```bash
cd frontend

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start production server
npm start
```

### Method 3: Cloud Platforms

#### AWS Deployment

1. **Use AWS ECS/Fargate**
   - Push Docker images to ECR
   - Create ECS task definitions
   - Deploy using Fargate

2. **Use AWS Elastic Beanstalk**
   - Create application
   - Upload docker-compose.yml
   - Configure environment variables

#### Azure Deployment

1. **Use Azure Container Instances**
   - Push to Azure Container Registry
   - Deploy container groups

2. **Use Azure App Service**
   - Deploy as Docker container
   - Configure app settings

#### Vercel (Frontend Only)

```bash
cd frontend
vercel --prod
```

#### Railway / Render / Heroku

Follow platform-specific guides for Docker deployment.

## Database Setup

### Production Database (Neon)

1. **Create database**
   - Go to Neon dashboard
   - Create production database
   - Copy connection string

2. **Run migrations**

```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

3. **Seed initial data**

```bash
DATABASE_URL="your-production-url" npm run db:seed
```

## Security Checklist

- [ ] Change all default secrets (JWT_SECRET, JWT_REFRESH_SECRET)
- [ ] Use strong passwords for all accounts
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Configure rate limiting
- [ ] Enable database SSL connection
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Review and lock down network access
- [ ] Set up firewall rules

## Performance Optimization

### Backend

- [ ] Enable production mode (`NODE_ENV=production`)
- [ ] Configure Prisma connection pooling
- [ ] Set up Redis for caching (optional)
- [ ] Enable compression middleware
- [ ] Configure CDN for static assets

### Frontend

- [ ] Enable Next.js production optimizations
- [ ] Configure image optimization
- [ ] Set up CDN for static files
- [ ] Enable caching headers
- [ ] Minify and compress assets

## Monitoring

### Recommended Tools

- **Application Monitoring**: New Relic, Datadog, or Application Insights
- **Error Tracking**: Sentry
- **Logging**: Winston + CloudWatch/Papertrail
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Database Monitoring**: Neon built-in monitoring

### Health Checks

Backend exposes `/api` endpoint for health checks.

## Backup Strategy

### Database Backups

1. **Neon Auto Backups**
   - Enabled by default
   - Point-in-time recovery available

2. **Manual Backups**

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Code Backups

- Use Git version control
- Tag releases
- Maintain multiple deployment branches

## Scaling

### Horizontal Scaling

1. **Backend**: Deploy multiple instances behind a load balancer
2. **Frontend**: Deploy to CDN with edge caching
3. **Database**: Use Neon's built-in connection pooling

### Vertical Scaling

- Upgrade server resources as needed
- Monitor performance metrics
- Scale based on traffic patterns

## Rollback Strategy

### Quick Rollback

```bash
# Docker
docker-compose down
docker-compose -f docker-compose.yml up -d --build [previous-tag]

# Manual
git checkout [previous-tag]
npm run build
npm run start:prod
```

### Database Rollback

```bash
# Prisma doesn't support automatic rollbacks
# Manual intervention required
# Restore from backup if needed
```

## SSL/TLS Configuration

### Using Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d api.yourdomain.com

# Configure nginx/reverse proxy
```

### Using Cloud Provider SSL

Most cloud providers offer free SSL certificates. Enable in platform settings.

## Reverse Proxy Setup (Nginx)

```nginx
# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment

1. **Test all endpoints**
   - Visit API documentation: https://api.yourdomain.com/api/docs
   - Test authentication flow
   - Verify brand isolation
   - Test price comparison
   - Place test order

2. **Monitor logs**
   - Check application logs
   - Monitor error rates
   - Review performance metrics

3. **Set up alerts**
   - Configure uptime alerts
   - Set error rate thresholds
   - Monitor database connections

## Troubleshooting

### Common Issues

**Database connection failed**
- Verify DATABASE_URL is correct
- Check database is accessible from deployment environment
- Verify SSL settings

**Prisma Client not generated**
- Run `npm run prisma:generate` after deployment
- Ensure Prisma is in dependencies (not devDependencies)

**CORS errors**
- Update FRONTEND_URL in backend .env
- Configure proper CORS origins

**Build failures**
- Check Node.js version (18+)
- Verify all dependencies installed
- Review build logs

## Support

For issues, check:
- Application logs
- Database logs
- Network connectivity
- Environment variables

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Monitor database size
- [ ] Review and optimize queries
- [ ] Update documentation

### Security Updates

- Monitor security advisories
- Update dependencies promptly
- Review access logs regularly

---

**Important**: Always test in staging environment before deploying to production!
