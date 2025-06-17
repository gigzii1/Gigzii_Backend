const Usermodel = require("../../models/User");
const OtpModel = require("../../models/Otp");
const sendmail = require("../../utils/mail");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../../models/User");
require("dotenv").config();

const signupUser = async (req, res) => {
  const { name, email, mobile, otp, city } = req.body;

  if (!name || !email || !mobile || !otp)
    return res.status(400).json({ error: "All fields are required" });

  const isValid = await verifyOtp(otp, email);
  if (!isValid) return res.status(400).json({ error: "Invalid OTP" });

  const user = new Usermodel({ name, email, mobile, role: "user", city });
  await user.save();
  const token = jwt.sign(
    { userId: user._id, userData: user.role },
    process.env.jwt_key,
    { expiresIn: "1h" }
  );

  res
    .status(201)
    .json({ status: true, message: "User Signup successfully", token });
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const existingOtp = await OtpModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { new: true, upsert: true }
    );

    await sendmail(email, `Your OTP for Gigzi is ${otp}`);
    res.status(201).json({ status: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, otp } = req.body;

  const isValid = await verifyOtp(otp, email);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  const user = await Usermodel.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role, userdata: user },
    process.env.JWT_KEY
  );

  await OtpModel.deleteMany({ email });

  res.status(200).json({
    status: true,
    message: "Login successful",
    token,
    user,
  });
};

const verifyOtp = async (otp, email) => {
  const existOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

  if (!existOtp) {
    console.log("No OTP found for", email);
    return false;
  }

  const storedOtp = String(existOtp.otp).trim();
  const givenOtp = String(otp).trim();
  const isMatch = storedOtp === givenOtp;

  console.log("DB OTP:", existOtp.otp, typeof existOtp.otp);
  console.log("User OTP:", otp, typeof otp);

  return isMatch;
};

const artistSignup = async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    adharfront,
    adharback,
    eventcategories,
    city,
  } = req.body;
  const isUser = await Usermodel.findOne({ phone });
  if (isUser) {
    res.status(500).json({ error: "Artist already registred" });
  }
  const Artist = new Usermodel({
    name: name,
    email: email,
    mobile: phone,
    role: "artist",
    address: address,
    adharfront: adharfront,
    adharback: adharback,
    isVerified: 0,
    eventcategories,
    city,
  });
  await Artist.save();
  res.status(201).json({ status: true, message: "Artist Signup successfully" });
};

const artistLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("yash", otp, email);
    const Artist = await Usermodel.findOne({ email });

    if (!Artist) {
      return res.status(404).json({ error: "Email not registered" });
    }

    if (Artist.isVerified === false) {
      return res.status(403).json({ error: "Verification under process" });
    }

    const isValid = await verifyOtp(otp, email);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    const token = jwt.sign(
      { userId: Artist._id, role: Artist.role },
      process.env.JWT_KEY
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const AdminLogin = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const isValid = await verifyOtp(otp, email);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    const admin = await Usermodel.findOne({ email, role: "admin" });
    if (!admin) {
      return res
        .status(404)
        .json({ error: "User does not exist or is not an admin" });
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.jwt_key
    );

    await OtpModel.deleteMany({ email });

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      admin,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = {
  signupUser,
  sendOTP,
  login,
  artistSignup,
  artistLogin,
  AdminLogin,
};
