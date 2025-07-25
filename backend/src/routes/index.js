const {Router} = require('express');

const authRouter = require('./auth.routes');
const productRouter = require('./product.routes');

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/products', productRouter);

module.exports = mainRouter;