require('dotenv').config();
const express = require('express');
const colors = require('colors');
const connectDB = require('./config/db');
const configureCloudinary = require('./config/cloudinary');
const mainRouter = require('./routes/index');
const cookieParser = require('cookie-parser');
const healthRouter = require('./routes/health.routes');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const PORT = process.env.PORT || 5000;

const app = express();
connectDB();
configureCloudinary();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

app.use('/health', healthRouter);
app.use('/api/v1', mainRouter);

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Inventory Management API',
  })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});