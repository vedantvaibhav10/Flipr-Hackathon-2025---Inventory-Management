const express = require('express');
const colors = require('colors');
require('dotenv').config();
const connectDB = require('./config/db');
const configureCloudinary = require('./config/cloudinary');
const mainRouter = require('./routes/index');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

const app = express();
connectDB();
configureCloudinary();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', mainRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Inventory Management API',
  })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});