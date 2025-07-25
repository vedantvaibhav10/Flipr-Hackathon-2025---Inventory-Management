const { Router } = require('express');
const { getDashboardSummary, exportProducts} = require('../controllers/reports.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = Router();

router.get('/summary', protect, authorize('Admin'), getDashboardSummary);
router.get('/products/export', protect, authorize('Admin'), exportProducts);

module.exports = router;