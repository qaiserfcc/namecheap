// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'E-Commerce Store';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const ORDER_STATUS_COLORS = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger'
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal'
};

export const PAYMENT_METHOD_LABELS = {
  cod: 'Cash on Delivery',
  card: 'Credit/Debit Card',
  bank_transfer: 'Bank Transfer',
  paypal: 'PayPal'
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  CART: 'cart'
};
