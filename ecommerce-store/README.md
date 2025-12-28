# E-Commerce Store - Complete Implementation

## 🎯 Overview

A complete, production-ready e-commerce store application built specifically for deployment on Stellar shared hosting at domain **namecheap.to**.

### Technology Stack

**Backend:**
- Node.js with Express.js (NOT NestJS)
- MySQL database with connection pooling
- JWT authentication with refresh tokens
- bcrypt password hashing
- Input validation with express-validator
- Rate limiting and security headers

**Frontend:**
- React 18 with hooks (NOT Next.js)
- Vite build tool
- React Router v6
- Tailwind CSS
- Axios for API calls
- Context API for state management
- React Hook Form
- React Toastify for notifications

## 📁 Project Structure

```
ecommerce-store/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MySQL connection with pooling
│   │   │   └── config.js            # Environment configuration
│   │   ├── models/
│   │   │   ├── User.js              # User model
│   │   │   ├── Product.js           # Product model with pricing
│   │   │   ├── Category.js          # Category model
│   │   │   ├── Cart.js              # Shopping cart model
│   │   │   └── Order.js             # Order & OrderItem models
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── productController.js # Product CRUD
│   │   │   ├── categoryController.js# Category CRUD
│   │   │   ├── cartController.js    # Cart operations
│   │   │   ├── orderController.js   # Order management
│   │   │   └── adminController.js   # Admin operations
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   ├── admin.js             # Admin authorization
│   │   │   ├── errorHandler.js      # Global error handling
│   │   │   └── validation.js        # Input validation rules
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth routes
│   │   │   ├── products.js          # Product routes
│   │   │   ├── categories.js        # Category routes
│   │   │   ├── cart.js              # Cart routes
│   │   │   ├── orders.js            # Order routes
│   │   │   └── admin.js             # Admin routes
│   │   ├── utils/
│   │   │   ├── jwt.js               # JWT utilities
│   │   │   └── validators.js        # Helper functions
│   │   └── server.js                # Express server
│   ├── migrations/
│   │   ├── init.sql                 # Complete DB schema
│   │   ├── run-migration.js         # Migration runner
│   │   └── create-admin.js          # Admin user creator
│   ├── .env.example
│   ├── .htaccess                    # Apache config for Stellar
│   ├── ecosystem.config.json        # PM2 configuration
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Header, Footer, Loading, etc.
│   │   │   ├── products/            # Product components
│   │   │   ├── cart/                # Cart components
│   │   │   ├── checkout/            # Checkout components
│   │   │   ├── auth/                # Auth components
│   │   │   └── admin/               # Admin components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication context
│   │   │   └── CartContext.jsx      # Cart context
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   ├── useCart.js           # Cart hook
│   │   │   └── useProducts.js       # Products hook
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── productService.js    # Product API calls
│   │   │   ├── cartService.js       # Cart API calls
│   │   │   ├── orderService.js      # Order API calls
│   │   │   ├── categoryService.js   # Category API calls
│   │   │   └── adminService.js      # Admin API calls
│   │   ├── utils/
│   │   │   ├── constants.js         # App constants
│   │   │   └── helpers.js           # Helper functions
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.jsx                # Entry point
│   │   └── index.css                # Tailwind styles
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
└── DEPLOYMENT.md                     # Deployment guide
```

## 🗄️ Database Schema

### Users Table
- User authentication and profiles
- Role-based access (customer, admin)
- Password hashing with bcrypt
- Email verification support

### Categories Table
- Product categorization
- Hierarchical structure support
- Display ordering
- Active/inactive status

### Products Table
- Complete product information
- Price and compare price
- Stock management
- SKU and barcode
- Image URLs and gallery
- SEO fields
- Full-text search capability

### Cart Table
- User shopping cart
- Product quantity tracking
- Automatic cleanup on order

### Orders Table
- Order management
- Multiple payment methods
- Order status tracking
- Shipping and billing addresses
- Admin notes
- Cancellation support

### Order Items Table
- Line items for orders
- Price history preservation
- Product snapshot

## 🔐 Security Features

1. **Password Security**
   - bcrypt hashing (10 rounds)
   - Password strength validation

2. **JWT Authentication**
   - Access tokens (24h expiry)
   - Refresh tokens (7d expiry)
   - Automatic token refresh

3. **API Security**
   - Rate limiting (100 req/15min)
   - Helmet.js security headers
   - CORS protection
   - SQL injection prevention (parameterized queries)

4. **Input Validation**
   - express-validator
   - Sanitization
   - Type checking

## 🚀 Features

### Customer Features
- User registration and login
- Browse products with filters
- Product search
- Add to cart
- Checkout with multiple payment methods
- Order tracking
- Order cancellation
- Profile management

### Admin Features
- Dashboard with statistics
- Product management (CRUD)
- Category management (CRUD)
- Order management
- Order status updates
- User management
- Role assignment

## 📊 API Endpoints

### Authentication (`/api/auth/`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /refresh-token` - Refresh access token

### Products (`/api/products/`)
- `GET /` - Get all products (pagination, filtering, search)
- `GET /featured` - Get featured products
- `GET /:id` - Get product by ID
- `GET /slug/:slug` - Get product by slug
- `POST /` - Create product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Categories (`/api/categories/`)
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `GET /slug/:slug` - Get category by slug
- `GET /:id/products` - Get products by category
- `POST /` - Create category (admin)
- `PUT /:id` - Update category (admin)
- `DELETE /:id` - Delete category (admin)

### Cart (`/api/cart/`)
- `GET /` - Get user's cart
- `GET /count` - Get cart item count
- `POST /add` - Add item to cart
- `PUT /update/:id` - Update cart item quantity
- `DELETE /remove/:id` - Remove item from cart
- `DELETE /clear` - Clear cart

### Orders (`/api/orders/`)
- `POST /` - Create order from cart
- `GET /` - Get user's orders
- `GET /:id` - Get single order
- `PUT /:id/cancel` - Cancel order

### Admin (`/api/admin/`)
- `GET /dashboard` - Get dashboard statistics
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status
- `GET /users` - Get all users
- `PUT /users/:id/role` - Update user role

## 🔧 Configuration

### Backend Environment Variables
```env
NODE_ENV=production
PORT=3001
DATABASE_HOST=your_mysql_host
DATABASE_PORT=3306
DATABASE_USER=your_mysql_user
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=ecommerce_store
JWT_SECRET=your-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
FRONTEND_URL=https://namecheap.to
CORS_ORIGIN=https://namecheap.to
```

### Frontend Environment Variables
```env
VITE_API_URL=https://namecheap.to/api
VITE_APP_URL=https://namecheap.to
```

## 📦 Installation

See individual README files in backend and frontend directories for detailed installation instructions.

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Stellar shared hosting deployment guide.

## 📝 Default Credentials

After setup:
- **Email**: admin@ecommerce.com
- **Password**: Admin@123

⚠️ **IMPORTANT**: Change this password immediately after first login!

## 🎨 Frontend Features

- Responsive design (mobile, tablet, desktop)
- Tailwind CSS styling
- React Router navigation
- Context API state management
- Form validation
- Toast notifications
- Protected routes
- Lazy loading images
- Persistent cart

## 🛠️ Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configure .env
npm run dev
```

## 📄 License

ISC
