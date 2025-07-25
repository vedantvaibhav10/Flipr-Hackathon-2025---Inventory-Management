const {Router} = require('express');

const authRouter = require('./auth.routes');
const productRouter = require('./product.routes');
const inventoryRouter = require('./inventory.routes');
const reportsRouter = require('./reports.routes');

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/products', productRouter);
mainRouter.use('/inventory', inventoryRouter);
mainRouter.use('/reports', reportsRouter);

module.exports = mainRouter;