const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');
const { categoryValidation, idValidation } = require('../middleware/validation');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', idValidation, categoryController.getCategoryById);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id/products', idValidation, categoryController.getProductsByCategory);

// Admin routes
router.post('/', auth, admin, categoryValidation, categoryController.createCategory);
router.put('/:id', auth, admin, idValidation, categoryController.updateCategory);
router.delete('/:id', auth, admin, idValidation, categoryController.deleteCategory);

module.exports = router;
