const Usermodel=require('../../models/User');
const OtpModel = require("../../models/Otp")
const sendmail=require("../../utils/mail")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require('../../models/User');

const signupUser = async (req, res) => {
    const { name, email, mobile, otp } = req.body;

    if (!name || !email || !mobile || !otp)
      return res.status(400).json({ error: 'All fields are required' });
   
    const isValid = await verifyOtp(otp, email);
    if (!isValid) return res.status(400).json({ error: 'Invalid OTP' });
  
    const user = new Usermodel({ name, email, mobile, role: 'user' });
    await user.save();
    const token = jwt.sign(
             { userId: user._id, userData: user.role },
                           process.env.jwt_key,
                { expiresIn: '1h' } 
);

  
    res.status(201).json({status:true, message: 'User Signup successfully',token });
  };


  const login = async (req, res) => {
  const { email, otp } = req.body;

  const isValid = await verifyOtp(otp, email);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  const user = await Usermodel.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User does not exist' });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    status: true,
    message: 'Login successful',
    token,
  });
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); 

    const existingOtp = await OtpModel.findOne({ email });

    if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.createdAt = new Date(); 
      await existingOtp.save();
    } else {
      const otpRecord = new OtpModel({ email, otp });
      await otpRecord.save();
    }

    await sendmail(email, `Your OTP for Gigzi is ${otp}`);

    res.status(201).json({ status: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  const verifyOtp = async (otp, email) => {
    const existOtp = await OtpModel.find({ email })
    if (!existOtp) return false;
  
    console.log("Stored OTP:", existOtp.otp, "Given OTP:", otp);
    return existOtp.otp == otp;
  };
  

  const artistSignup=async(req,res)=>{
     const{name,email,phone,address,adharfront,adharback,eventcategories}=req.body;
    const isUser=await Usermodel.findOne({phone});
    if(isUser){
      res.status(500).json({ error: 'Artist already registred' });
    }
    const Artist=new Usermodel({name:name,email:email,mobile:phone,role:"artist",address:address,adharfront:adharfront,adharback:adharback,isVerified:0,eventcategories})
    await Artist.save();
    res.status(201).json({status:true, message: 'Artist Signup successfully' });

  }

  module.exports = { signupUser,sendOTP,login,artistSignup };