const { Router } = require('express');
const {
    getReorderSuggestion,
    getSupplierAnalysis,
    getPricingSuggestion,
} = require('../controllers/ai.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = Router();

// All AI routes are protected and for Admins only
router.use(protect, authorize('Admin'));

router.get('/reorder-suggestion/:productId', getReorderSuggestion);
router.get('/supplier-analysis/:supplierId', getSupplierAnalysis);
router.get('/pricing-suggestion/:productId', getPricingSuggestion);

module.exports = router;
