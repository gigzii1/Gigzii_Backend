const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
   email:{type:String},otp:{type:String,unique:true}, 
   createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 
  }
});

module.exports = mongoose.model('Otp', OtpSchema);