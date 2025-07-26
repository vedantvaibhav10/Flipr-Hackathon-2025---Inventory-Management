require('dotenv').config();
const express = require('express');
const colors = require('colors');
const connectDB = require('./config/db');
const configureCloudinary = require('./config/cloudinary');
const mainRouter = require('./routes/index');
const cookieParser = require('cookie-parser');
const healthRouter = require('./routes/health.routes');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
connectDB();
configureCloudinary();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  // Add your deployed frontend URL here when you have one
];

// CORRECTED CORS CONFIGURATION
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman) and from allowed origins
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

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Inventory Management API',
  })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green);
});