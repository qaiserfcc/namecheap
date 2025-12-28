const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');
const { productValidation, idValidation } = require('../middleware/validation');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', idValidation, productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);

// Admin routes
router.post('/', auth, admin, productValidation, productController.createProduct);
router.put('/:id', auth, admin, idValidation, productController.updateProduct);
router.delete('/:id', auth, admin, idValidation, productController.deleteProduct);

module.exports = router;
