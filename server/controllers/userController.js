const User = require("../models/User");
const OTP = require("../models/otp")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();

const signup = async (req, res) => {
  const { FirstName, LastName, email, password } = req.body.userdata;
  const {otp} = req.body;
  
  if (!FirstName || !LastName || !email || !password || !otp) {
    return res.status(400).json({ error: "Please enter all the required details." });
  }
  if(password.length < 6){
    return res.status(400).json({ error: "Password should be of minimum 6 characters." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("already exist user")
      return res.status(400).json({ error: "user already exists" });
    }
    const newUser = new User({ FirstName, LastName, email, password });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP or email' });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await newUser.save();
    await OTP.deleteOne({ email });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Please enter valid email." });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body.userdata;
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter the Credentials." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "User does not exist." });
    }

    bcrypt.compare(password, existingUser.password).then((isMatch) => {
      if (!isMatch) res.status(400).json({ error: "Wrong User Credentials" });
    });
    console.log("id_ h ya nahi", existingUser.Id);

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    return res.json({existingUser,token});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const get_user = (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      res.json(user);
    });
};

module.exports = { signup, signin, get_user };
