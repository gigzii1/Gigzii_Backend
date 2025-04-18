const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile:{type:Number,require:true},
  role: { type: String, enum: ['user', 'artist', 'admin'], default: 'user' },
  portfolio: { type: String }, // Only for artists
  Address: { type: String }, 
  pricing: { type: Number }, // Only for artists
//   availability: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Availability' }], // Only for artists
  permissions: { type: Array }, // Only for admins
});

module.exports = mongoose.model('User', UserSchema);