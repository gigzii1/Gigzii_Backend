const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  mobile:{type:Number,require:true},
  role: { type: String, enum: ['user', 'artist', 'admin'], default: 'user' },
  portfolio: { type: String },
  Address: { type: String }, 
  pricing: { type: Number },
  permissions: { type: Array }, 
  adharfront:{type:String},
  adharback:{type:String},
  isVerified:{type:Boolean},
   eventcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Eventcategory" }],
});

module.exports = mongoose.model('User', UserSchema);