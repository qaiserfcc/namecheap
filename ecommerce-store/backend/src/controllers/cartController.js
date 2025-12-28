const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.getCartItems(req.user.id);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    
    if (!product.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available.'
      });
    }
    
    // Check stock availability
    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available.'
      });
    }
    
    await Cart.addItem(req.user.id, productId, quantity);
    
    const cart = await Cart.getCartItems(req.user.id);
    
    res.json({
      success: true,
      message: 'Item added to cart.',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity.'
      });
    }
    
    await Cart.updateQuantity(id, req.user.id, quantity);
    
    const cart = await Cart.getCartItems(req.user.id);
    
    res.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart.' : 'Cart updated.',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await Cart.removeItem(id, req.user.id);
    
    const cart = await Cart.getCartItems(req.user.id);
    
    res.json({
      success: true,
      message: 'Item removed from cart.',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear entire cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.clearCart(req.user.id);
    
    res.json({
      success: true,
      message: 'Cart cleared.'
    });
  } catch (error) {
    next(error);
  }
};

// Get cart item count
exports.getCartCount = async (req, res, next) => {
  try {
    const count = await Cart.getItemCount(req.user.id);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};
