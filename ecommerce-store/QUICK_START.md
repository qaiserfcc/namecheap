# Quick Start Guide - E-Commerce Store

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+
- MySQL 5.7+ or 8.0+

### Backend Setup

```bash
# Navigate to backend
cd ecommerce-store/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# DATABASE_HOST=localhost
# DATABASE_USER=root
# DATABASE_PASSWORD=your_password
# DATABASE_NAME=ecommerce_store

# Run database migration
npm run db:init

# Create admin user
node migrations/create-admin.js

# Start development server
npm run dev
```

Backend will start on http://localhost:3001

### Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd ecommerce-store/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will start on http://localhost:3000

### Test the Application

1. Visit http://localhost:3000
2. Click "Login"
3. Use credentials:
   - Email: `admin@ecommerce.com`
   - Password: `Admin@123`
4. Browse featured products
5. Access admin panel at /admin

## 📋 Default Credentials

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `Admin@123`

⚠️ **IMPORTANT:** Change this password after first login!

## 🔍 What You Can Do

### As Admin
- View dashboard statistics
- Manage products (create, edit, delete)
- Manage categories
- View and update orders
- Manage users

### As Customer
- Browse products
- Search and filter
- Add items to cart
- Place orders
- Track orders
- Manage profile

## 📡 API Testing

Test backend API endpoints:

```bash
# Health check
curl http://localhost:3001/health

# Get products
curl http://localhost:3001/api/products

# Login (get JWT token)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"Admin@123"}'
```

## 📁 Project Structure

```
ecommerce-store/
├── backend/          # Express.js API (Port 3001)
│   ├── src/         # Source code
│   └── migrations/  # Database scripts
└── frontend/        # React SPA (Port 3000)
    └── src/        # Source code
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=ecommerce_store
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🐛 Common Issues

**Database connection error:**
- Check MySQL is running
- Verify credentials in .env
- Ensure database exists

**Port already in use:**
- Change PORT in backend .env
- Change port in frontend vite.config.js

**CORS error:**
- Verify CORS_ORIGIN in backend .env
- Should match frontend URL

## 📚 Documentation

- [README.md](./README.md) - Complete overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [backend/README.md](./backend/README.md) - Backend API docs
- [frontend/README.md](./frontend/README.md) - Frontend guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details

## 🚀 Production Deployment

For deploying to Stellar shared hosting at namecheap.to, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 💡 Tips

1. Use separate terminals for backend and frontend
2. Backend must be running for frontend to work
3. Check browser console for frontend errors
4. Check terminal logs for backend errors
5. Use Postman or curl to test API endpoints

## 🎯 Next Steps

1. Change admin password
2. Add your products and categories
3. Customize branding (logo, colors)
4. Configure payment gateway
5. Deploy to production

## 📞 Need Help?

Check the documentation files or review the code comments for detailed information.
