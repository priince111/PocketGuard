const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const OTP = require("../models/otp");
const dotenv = require('dotenv').config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};
const sendOTP = async (req, res) => {
  const { FirstName, LastName, email } = req.body;
  console.log(req.body);

  if (!FirstName || !LastName || !email) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  try {
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const otpEntry = new OTP({
      email,
      otp,
      otpExpires,
    });

    await otpEntry.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("err",error)
        return res.status(500).json({ error: "Failed to send OTP email." });
      }
      res.status(200).json({ message: "OTP sent to your email." });
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = {
  sendOTP,
};
