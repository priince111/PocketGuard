const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const transactionRoute = require("./routes/TransactionRoute");
const userRoute = require("./routes/userRoute");
const otpRoute = require("./routes/otpRoute");
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000', 'https://pocketguard-v2.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

mongoose
  .connect(process.env.dbURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use('/api', transactionRoute);
app.use('/api', userRoute);
app.use('/api', otpRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
