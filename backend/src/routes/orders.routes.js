const { Router } = require('express');
const {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
} = require('../controllers/orders.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = Router();

router.post('/sync', protect, authorize('Admin', 'Staff'), createOrder);

router.route('/')
    .post(protect, authorize('Admin', 'Staff'), createOrder)
    .get(protect, authorize('Admin', 'Staff'), getOrders);

router.route('/:id')
    .put(protect, authorize('Admin', 'Staff'), updateOrder)
    .delete(protect, authorize('Admin'), deleteOrder);

module.exports = router;
