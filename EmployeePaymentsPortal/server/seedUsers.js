// Run with: node seedUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employee_payments_portal';
mongoose.connect(MONGO_URI).then(async ()=>{
  console.log('Connected to Mongo for seeding');

  const users = [
    { username: 'employee1', email: 'employee1@company.com', password: 'Password123', balance: 1000 },
    { username: 'employee2', email: 'employee2@company.com', password: 'Password123', balance: 500 }
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) { console.log('User exists', u.email); continue; }
    const hashed = await bcrypt.hash(u.password, 14);
    const newUser = new User({ username: u.username, email: u.email, password: hashed, balance: u.balance, role: 'employee' });
    await newUser.save();
    console.log('Created user', u.email);
  }
  console.log('Seeding complete');
  process.exit(0);
}).catch(err=>{ console.error(err); process.exit(1); });
