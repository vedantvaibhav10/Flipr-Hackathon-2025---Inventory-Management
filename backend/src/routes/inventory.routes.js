const {Router} = require('express');
const { updateStock, getInventoryLogs } = require('../controllers/inventory.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = Router();

router.post('/update', protect, authorize('Admin', 'Staff'), updateStock);
router.get('/logs', protect, authorize('Admin'), getInventoryLogs);

module.exports = router;