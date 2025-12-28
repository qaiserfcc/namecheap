# Deployment Guide for Stellar Shared Hosting

Complete step-by-step guide to deploy the e-commerce store on Stellar shared hosting at **namecheap.to** domain.

## 📋 Prerequisites

- Stellar shared hosting account with:
  - Node.js support (18+)
  - MySQL database access
  - SSH/FTP access
  - SSL certificate (recommended)

## 🗄️ Database Setup

### Step 1: Create MySQL Database

1. Log into your hosting control panel (cPanel)
2. Navigate to **MySQL Databases**
3. Create a new database:
   - Database name: `ecommerce_store`
   - Note down the full database name (usually prefixed with your username)

### Step 2: Create Database User

1. Create a new MySQL user
2. Set a strong password
3. Note down username and password
4. Add user to the database with ALL PRIVILEGES

### Step 3: Import Database Schema

**Method 1: Using phpMyAdmin**
1. Open phpMyAdmin from cPanel
2. Select your database
3. Click on "Import" tab
4. Upload `/backend/migrations/init.sql`
5. Click "Go" to execute

**Method 2: Using SSH**
```bash
mysql -u your_db_user -p your_db_name < backend/migrations/init.sql
```

### Step 4: Create Admin User

**Using SSH:**
```bash
cd backend
node migrations/create-admin.js
```

**Or manually in phpMyAdmin:**
```sql
-- First, generate bcrypt hash for "Admin@123" using online tool or Node.js
-- Then insert:
INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified)
VALUES ('admin@ecommerce.com', '$2a$10$YourBcryptHashHere', 'System', 'Administrator', 'admin', 1, 1);
```

## 🚀 Backend Deployment

### Step 1: Prepare Backend Files

On your local machine:

```bash
cd backend
npm install --production
```

### Step 2: Configure Environment

Create `.env` file in backend directory:

```env
NODE_ENV=production
PORT=3001

# Database Configuration (from hosting provider)
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name

# JWT Secrets (generate strong random strings)
JWT_SECRET=generate-a-strong-secret-key-min-32-characters
JWT_REFRESH_SECRET=generate-a-different-strong-secret-min-32-characters
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Frontend URL
FRONTEND_URL=https://namecheap.to
CORS_ORIGIN=https://namecheap.to

# Connection Pool
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Upload Backend Files

**Using FTP/SFTP:**

1. Connect to your hosting via FTP (FileZilla, WinSCP, etc.)
2. Navigate to your domain's directory (usually `public_html` or `www`)
3. Create `api` directory: `public_html/api/`
4. Upload all backend files to `public_html/api/`:
   - `src/` directory
   - `migrations/` directory
   - `node_modules/` directory
   - `.env` file
   - `package.json`
   - `ecosystem.config.json`
   - `.htaccess`

**Using SSH:**

```bash
# From your local machine
scp -r backend/* username@your-server.com:~/public_html/api/
```

### Step 4: Configure .htaccess for Backend

Ensure `.htaccess` is in the `api` directory:

```apache
RewriteEngine On
RewriteBase /api/

# Force HTTPS (if SSL is enabled)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Forward all requests to Node.js app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Step 5: Start Backend Server

**Using PM2 (Recommended):**

```bash
# SSH into your server
ssh username@your-server.com

cd ~/public_html/api

# Install PM2 globally (if not already installed)
npm install -g pm2

# Start application with PM2
pm2 start ecosystem.config.json

# Save PM2 process list
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

**Alternative: Using nohup:**

```bash
cd ~/public_html/api
nohup node src/server.js > server.log 2>&1 &
```

### Step 6: Verify Backend

Test the API:
```bash
curl https://namecheap.to/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "...",
  "environment": "production"
}
```

## 🎨 Frontend Deployment

### Step 1: Build Frontend

On your local machine:

```bash
cd frontend

# Create production .env
cat > .env << EOF
VITE_API_URL=https://namecheap.to/api
VITE_APP_URL=https://namecheap.to
EOF

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist/` directory with optimized production files.

### Step 2: Upload Frontend Files

**Using FTP/SFTP:**

1. Connect to your hosting
2. Navigate to `public_html/` (document root for namecheap.to)
3. Upload all files from `frontend/dist/` to `public_html/`:
   - `index.html`
   - `assets/` directory
   - All other files

**Using SSH:**

```bash
scp -r frontend/dist/* username@your-server.com:~/public_html/
```

### Step 3: Configure .htaccess for Frontend

Create `.htaccess` in `public_html/` (root directory):

```apache
# Enable RewriteEngine
RewriteEngine On
RewriteBase /

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Don't rewrite files or directories
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Don't rewrite API requests
RewriteRule ^api/ - [L]

# Rewrite everything else to index.html
RewriteRule ^ index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

## 🔐 SSL Configuration

### Enable SSL Certificate

1. In cPanel, go to **SSL/TLS Status**
2. Install Let's Encrypt certificate for `namecheap.to`
3. Force HTTPS redirect (already in .htaccess)

## ✅ Post-Deployment Checklist

- [ ] Database created and schema imported
- [ ] Admin user created
- [ ] Backend .env configured with production values
- [ ] Backend files uploaded
- [ ] Backend server running (PM2)
- [ ] Backend API responding (test /api/health)
- [ ] Frontend built with production env vars
- [ ] Frontend files uploaded
- [ ] Frontend .htaccess configured
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] Can login with admin credentials
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Can create orders
- [ ] Admin panel accessible

## 🔍 Testing

### Test API Endpoints

```bash
# Health check
curl https://namecheap.to/api/health

# Get products
curl https://namecheap.to/api/products

# Login (should return JWT token)
curl -X POST https://namecheap.to/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"Admin@123"}'
```

### Test Frontend

1. Visit https://namecheap.to
2. Navigate to Shop page
3. View product details
4. Test login
5. Test admin panel

## 🐛 Troubleshooting

### Backend Not Responding

1. Check if Node.js process is running:
   ```bash
   pm2 list
   ```

2. Check server logs:
   ```bash
   pm2 logs ecommerce-backend
   ```

3. Restart server:
   ```bash
   pm2 restart ecommerce-backend
   ```

### Database Connection Errors

1. Verify database credentials in `.env`
2. Check if database user has proper privileges
3. Ensure database server is accessible from hosting

### Frontend Not Loading

1. Verify all files uploaded correctly
2. Check .htaccess syntax
3. Clear browser cache
4. Check browser console for errors

### CORS Errors

1. Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
2. Ensure backend .htaccess allows API requests
3. Check frontend is using correct API URL

### 500 Internal Server Error

1. Check backend logs
2. Verify Node.js version compatibility
3. Ensure all dependencies installed
4. Check file permissions

## 🔄 Updates and Maintenance

### Update Backend

```bash
# SSH into server
ssh username@your-server.com
cd ~/public_html/api

# Pull latest changes or upload new files
# ...

# Install new dependencies if any
npm install --production

# Restart server
pm2 restart ecommerce-backend
```

### Update Frontend

```bash
# On local machine
cd frontend
npm run build

# Upload new dist files
scp -r dist/* username@your-server.com:~/public_html/
```

### Database Backups

Regular backups recommended:

```bash
# From cPanel or SSH
mysqldump -u your_db_user -p your_db_name > backup_$(date +%Y%m%d).sql
```

## 📞 Support

For issues specific to:
- **Stellar Hosting**: Contact hosting support
- **Application**: Check application logs and documentation

## 🎉 Congratulations!

Your e-commerce store is now live at https://namecheap.to

Remember to:
1. Change admin password immediately
2. Add your products
3. Configure payment gateways
4. Set up regular backups
5. Monitor server logs
6. Keep dependencies updated
