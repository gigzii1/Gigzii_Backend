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
    { userId: user._id, role: user.role,userdata:user },
    process.env.JWT_KEY
  );

  res.status(200).json({
    status: true,
    message: 'Login successful',
    token,
    user
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
  const existOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 }); 

  if (!existOtp) return false;

  console.log("Stored OTP:", existOtp.otp, "Given OTP:", otp);
  return existOtp.otp === otp;
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


 const artistLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
     console.log("yash",otp,email)
    const Artist = await Usermodel.findOne({ email }); 

    if (!Artist) {
      return res.status(404).json({ error: 'Email not registered' });
    }

    if (Artist.isVerified === false) {
      return res.status(403).json({ error: 'Verification under process' });
    }

    const isValid = await verifyOtp(otp, email); 

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    const token = jwt.sign(
      { userId: Artist._id, role: Artist.role },
      process.env.JWT_KEY,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      status: true,
      message: 'Login successful',
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

  module.exports = { signupUser,sendOTP,login,artistSignup,artistLogin };