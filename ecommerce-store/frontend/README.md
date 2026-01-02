# E-Commerce Store - Frontend

Production-ready React frontend for e-commerce store.

## 🚀 Features

- **React 18** with modern hooks
- **Vite** for fast development and building
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management
- **React Hook Form** for forms
- **React Toastify** for notifications
- **Responsive Design** (mobile-first)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your API URL
# Edit .env file
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Development
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=http://localhost:3000

# Production (for build)
# VITE_API_URL=https://namecheap.to/api
# VITE_APP_URL=https://namecheap.to
```

## 💻 Development

```bash
# Start development server
npm run dev

# Access at http://localhost:3000
```

## 🏗️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

Output will be in `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── products/        # Product-related components
│   ├── cart/            # Shopping cart components
│   ├── checkout/        # Checkout components
│   ├── auth/            # Authentication components
│   └── admin/           # Admin panel components
├── pages/               # Page components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── utils/               # Helper functions & constants
├── App.jsx              # Main app component
├── index.jsx            # Entry point
└── index.css            # Global styles
```

## 🎨 Pages

### Public Pages
- **Home** (`/`) - Landing page with featured products
- **Shop** (`/shop`) - Product catalog with filters
- **Product Detail** (`/product/:slug`) - Single product view
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

### Protected Pages (Require Login)
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Order checkout
- **Orders** (`/orders`) - Order history
- **Profile** (`/profile`) - User profile

### Admin Pages (Require Admin Role)
- **Admin Dashboard** (`/admin`) - Admin panel
- **Product Management** - CRUD operations
- **Order Management** - Order handling
- **User Management** - User administration

## 🔐 Authentication

### Login Flow

1. User submits credentials
2. API returns JWT token and refresh token
3. Tokens stored in localStorage
4. Token included in subsequent API requests
5. Automatic token refresh on expiry

### Protected Routes

Routes wrapped with:
- `<PrivateRoute>` - Requires authentication
- `<AdminRoute>` - Requires admin role

## 🛒 State Management

### Auth Context

```jsx
const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
```

### Cart Context

```jsx
const { cart, addToCart, updateCartItem, removeFromCart } = useCart();
```

## 📡 API Integration

All API calls are centralized in `services/`:

```javascript
// Example: Fetch products
import productService from './services/productService';

const response = await productService.getAll({ page: 1, limit: 12 });
```

### Services Available

- `authService` - Authentication
- `productService` - Products
- `categoryService` - Categories
- `cartService` - Shopping cart
- `orderService` - Orders
- `adminService` - Admin operations

## 🎯 Custom Hooks

### useAuth
```jsx
const { user, login, logout, isAuthenticated } = useAuth();
```

### useCart
```jsx
const { cart, addToCart, removeFromCart } = useCart();
```

### useProducts
```jsx
const { products, loading, error, pagination } = useProducts({ page: 1 });
```

## 🎨 Styling

### Tailwind CSS

Using utility-first CSS with Tailwind.

### Custom Classes

Predefined classes in `index.css`:
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.input`
- `.card`
- `.badge`, `.badge-success`, `.badge-danger`

### Responsive Design

Mobile-first approach with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 📦 Build Output

Production build creates:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Source maps (optional)

### Build Size Optimization

- Code splitting
- Tree shaking
- Asset compression
- Lazy loading

## 🚀 Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Build
npm run build

# Upload dist/ contents to web server
```

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

ISC
