const { Router } = require('express');

const authRouter = require('./auth.routes');
const productRouter = require('./product.routes');
const inventoryRouter = require('./inventory.routes');
const reportsRouter = require('./reports.routes');
const suppliersRouter = require('./suppliers.routes');
const ordersRouter = require('./orders.routes');
const aiRouter = require('./ai.routes');
const searchRouter = require('./search.routes');

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/products', productRouter);
mainRouter.use('/inventory', inventoryRouter);
mainRouter.use('/reports', reportsRouter);
mainRouter.use('/suppliers', suppliersRouter);
mainRouter.use('/orders', ordersRouter);
mainRouter.use('/ai', aiRouter);
mainRouter.use('/search', searchRouter);

module.exports = mainRouter;