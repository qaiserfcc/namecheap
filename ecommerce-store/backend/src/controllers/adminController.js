const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Get dashboard statistics
exports.getDashboard = async (req, res, next) => {
  try {
    const orderStats = await Order.getDashboardStats();
    
    // Get product stats
    const productsSql = 'SELECT COUNT(*) as total FROM products WHERE is_active = TRUE';
    const { query } = require('../config/database');
    const productsResult = await query(productsSql);
    
    const categoriesSql = 'SELECT COUNT(*) as total FROM categories WHERE is_active = TRUE';
    const categoriesResult = await query(categoriesSql);
    
    const usersSql = 'SELECT COUNT(*) as total FROM users WHERE is_active = TRUE';
    const usersResult = await query(usersSql);
    
    const lowStockSql = 'SELECT COUNT(*) as total FROM products WHERE stock_quantity <= low_stock_threshold AND is_active = TRUE';
    const lowStockResult = await query(lowStockSql);
    
    const stats = {
      orders: orderStats,
      products: {
        total: productsResult[0].total,
        lowStock: lowStockResult[0].total
      },
      categories: categoriesResult[0].total,
      users: usersResult[0].total
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    
    const filters = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    };
    
    if (status) filters.status = status;
    
    const result = await Order.getAll(filters);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status.'
      });
    }
    
    const order = await Order.updateStatus(id, status, adminNote);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    
    const result = await User.getAll(
      parseInt(page) || 1,
      parseInt(limit) || 20
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update user role (admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role.'
      });
    }
    
    // Prevent admin from changing their own role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role.'
      });
    }
    
    const user = await User.update(id, { role });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    res.json({
      success: true,
      message: 'User role updated successfully.',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Get order details (admin)
exports.getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
