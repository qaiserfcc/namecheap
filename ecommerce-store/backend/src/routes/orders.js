const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
const { orderValidation, idValidation } = require('../middleware/validation');

// All order routes require authentication
router.use(auth);

router.post('/', orderValidation, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', idValidation, orderController.getOrderById);
router.put('/:id/cancel', idValidation, orderController.cancelOrder);

module.exports = router;
