const { Router } = require('express');
const {
    createSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
} = require('../controllers/suppliers.controller');
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const router = Router();

router.post('/sync', protect, authorize('Admin'), createSupplier);
router.put('/:id/sync', protect, authorize('Admin'), updateSupplier);

router.route('/')
    .post(protect, authorize('Admin'), createSupplier)
    .get(protect, authorize('Admin', 'Staff'), getSuppliers);

router.route('/:id')
    .put(protect, authorize('Admin'), updateSupplier)
    .delete(protect, authorize('Admin'), deleteSupplier);

module.exports = router;
