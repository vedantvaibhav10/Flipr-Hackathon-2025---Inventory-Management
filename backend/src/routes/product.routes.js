const {Router} = require('express');
const { createProduct, getAllProducts } = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = Router();

router.get('/', protect, authorize('Admin', 'Staff'), getAllProducts);
router.post('/', protect, authorize('Admin'), createProduct);

module.exports = router;