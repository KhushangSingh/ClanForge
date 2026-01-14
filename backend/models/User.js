const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Identity
  uid: { type: String, required: true, unique: true },
  
  name: { type: String, required: true }, 
  
  email: { type: String, required: true, unique: true }, 
  
  // FIXED: Password is NOT required (for Google Auth users)
  password: { type: String, required: false },

  // Profile Extras
  avatarId: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  // showContact is deprecated but kept for schema compatibility
  showContact: { type: Boolean, default: false },
  portfolio: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  customLinks: [
    {
      label: { type: String },
      url: { type: String }
    }
  ],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);