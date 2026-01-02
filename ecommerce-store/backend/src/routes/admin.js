const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const admin = require('../middleware/admin');
const { idValidation } = require('../middleware/validation');

// All admin routes require authentication and admin role
router.use(auth);
router.use(admin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Orders management
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', idValidation, adminController.getOrderDetails);
router.put('/orders/:id/status', idValidation, adminController.updateOrderStatus);

// Users management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', idValidation, adminController.updateUserRole);

module.exports = router;
