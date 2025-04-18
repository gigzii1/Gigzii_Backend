const Usermodel=require('../../models/User');
const OtpModel = require("../../models/Otp")
const sendmail=require("../../utils/mail")
const signupUser = async (req, res) => {
    const { name, email, mobile, otp } = req.body;

    if (!name || !email || !mobile || !otp)
      return res.status(400).json({ error: 'All fields are required' });
   
    const isValid = await verifyOtp(otp, email);
    if (!isValid) return res.status(400).json({ error: 'Invalid OTP' });
  
    const user = new Usermodel({ name, email, mobile, role: 'user' });
    await user.save();
  
    res.status(201).json({status:true, message: 'User Signup successfully' });
  };


  const sendOTP = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); 
    
    const otpRecord = new OtpModel({
      email: email,
      otp: otp
    });
    await otpRecord.save();
    
    sendmail(email,` Your Otp For Gigzi  is ${otp} `);
    res.status(201).json({status:true, message: 'Otp Sent successfully' });
  };


  const verifyOtp = async (otp, email) => {
    const existOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 }); // latest one
  
    if (!existOtp) return false;
  
    console.log("Stored OTP:", existOtp.otp, "Given OTP:", otp);
    return existOtp.otp == otp;
  };
  


  module.exports = { signupUser,sendOTP };