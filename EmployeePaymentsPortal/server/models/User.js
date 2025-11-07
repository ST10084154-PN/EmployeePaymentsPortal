const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9]{3,20}$/ },
  email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: String, required: true },
  role: { type: String, default: 'employee' },
  balance: { type: Number, default: 0 },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null }
});
module.exports = mongoose.model('User', userSchema);
