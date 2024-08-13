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
app.use(cors());
app.use(cors({
  origin: 'pocket-guard-frontend.vercel.app'
}));
app.use(cookieParser());

mongoose
  .connect(process.env.dbURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use('/api',transactionRoute);
app.use('/api',userRoute)
app.use('/api',otpRoute)

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));