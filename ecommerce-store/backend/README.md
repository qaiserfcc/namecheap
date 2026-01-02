# E-Commerce Store Backend

Production-ready Express.js backend for e-commerce store with MySQL database.

## 🚀 Features

- **RESTful API** with Express.js
- **MySQL Database** with connection pooling
- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (Customer, Admin)
- **Input Validation** with express-validator
- **Error Handling** middleware
- **Rate Limiting** for API protection
- **Security** with Helmet.js
- **CORS** configuration
- **Comprehensive API** endpoints

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 5.7+ or 8.0+
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
NODE_ENV=development
PORT=3001

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_mysql_user
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=ecommerce_store

JWT_SECRET=your-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 3. Create Database & Run Migrations

```bash
# Run database migration
npm run db:init

# Create admin user
node migrations/create-admin.js
```

### 4. Start Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=12&categoryId=1&search=keyword&sortBy=price&order=ASC
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "categoryId": 1,
  "name": "Product Name",
  "slug": "product-name",
  "description": "Product description",
  "price": 99.99,
  "comparePrice": 149.99,
  "sku": "PROD-001",
  "stockQuantity": 100,
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true,
  "isFeatured": true
}
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer {token}
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "cod",
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  }
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

#### Get All Orders
```http
GET /api/admin/orders?page=1&limit=20&status=pending
Authorization: Bearer {admin_token}
```

#### Update Order Status
```http
PUT /api/admin/orders/:id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped",
  "adminNote": "Shipped via FedEx"
}
```

## 🔒 Default Credentials

After running migrations and creating admin:

- **Email**: admin@ecommerce.com
- **Password**: Admin@123

⚠️ **Change this password immediately after first login!**

## 📦 Database Schema

- **users**: User accounts with authentication
- **categories**: Product categories
- **products**: Products with pricing and inventory
- **cart**: Shopping cart items
- **orders**: Customer orders
- **order_items**: Order line items

## 🚀 Deployment

### Stellar Shared Hosting

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete deployment instructions.

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_HOST=your_db_host
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
FRONTEND_URL=https://namecheap.to
CORS_ORIGIN=https://namecheap.to
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Helmet.js security headers
- CORS protection
- SQL injection prevention (parameterized queries)
- Input validation and sanitization

## 📝 License

ISC
