require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_inclusion';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

(async () => {
  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env to seed admin');
    process.exit(1);
  }
  await connectDB(MONGO);
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin exists, skipping');
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, passwordHash: hash, name: 'Admin' });
  await admin.save();
  console.log('Admin seeded:', email);
  process.exit(0);
})();
