const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { generateOrderNumber } = require('../utils/validators');

// Create order from cart
exports.createOrder = async (req, res, next) => {
  try {
    const { paymentMethod, shippingAddress, billingAddress, customerNote } = req.body;
    
    // Get cart items
    const cart = await Cart.getCartItems(req.user.id);
    
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty.'
      });
    }
    
    // Validate stock availability for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product_id);
      
      if (!product || !product.is_active) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product_name}" is no longer available.`
        });
      }
      
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product_name}". Available: ${product.stock_quantity}`
        });
      }
    }
    
    // Calculate totals
    const subtotal = cart.summary.subtotal;
    const taxAmount = 0; // Can be calculated based on location
    const shippingAmount = 0; // Can be calculated based on shipping method
    const discountAmount = 0; // Can be applied from coupon codes
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
    
    // Prepare order items
    const orderItems = cart.items.map(item => ({
      productId: item.product_id,
      productName: item.product_name,
      productSku: item.sku || null,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));
    
    // Create order
    const orderData = {
      userId: req.user.id,
      orderNumber: generateOrderNumber(),
      totalAmount,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      paymentMethod,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      customerNote
    };
    
    const orderId = await Order.create(orderData, orderItems);
    
    // Clear cart after successful order
    await Cart.clearCart(req.user.id);
    
    // Get created order
    const order = await Order.findById(orderId);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get user's orders
exports.getOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    
    const filters = {
      userId: req.user.id,
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

// Get single order
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id, req.user.id);
    
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

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    await Order.cancel(id, req.user.id, reason || 'Customer requested cancellation');
    
    const order = await Order.findById(id, req.user.id);
    
    res.json({
      success: true,
      message: 'Order cancelled successfully.',
      data: order
    });
  } catch (error) {
    if (error.message.includes('cannot be cancelled')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};
