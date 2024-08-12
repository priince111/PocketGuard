const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true},
  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true, index: { expires: 0 } },
});

OTPSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
