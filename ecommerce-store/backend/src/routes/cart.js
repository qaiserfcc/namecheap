const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');
const { addToCartValidation, idValidation } = require('../middleware/validation');

// All cart routes require authentication
router.use(auth);

router.get('/', cartController.getCart);
router.get('/count', cartController.getCartCount);
router.post('/add', addToCartValidation, cartController.addToCart);
router.put('/update/:id', idValidation, cartController.updateCartItem);
router.delete('/remove/:id', idValidation, cartController.removeCartItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;
