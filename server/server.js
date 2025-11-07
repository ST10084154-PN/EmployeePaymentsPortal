const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const logger = require('./logger');

const app = express();

// middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'","'unsafe-inline'"],
      imgSrc: ["'self'","data:"],
      connectSrc: ["'self'","http://localhost:5000"],
    }
  }
}));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(cors({ origin: 'http://localhost:3000' }));
const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
app.use(limiter);

// Force HTTPS if enabled via env
app.use((req, res, next) => {
  if (process.env.FORCE_HTTPS === 'true') {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
  }
  next();
});

// auth middleware used in payments route mounting is added inside routes configuration
app.use('/api/auth', authRoutes);
// require auth for payments route
const jwt = require('jsonwebtoken');
function requireAuth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: 'Invalid token' });
    req.user = decoded;
    next();
  });
}
app.use('/api/payments', requireAuth, paymentRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Check server/.env');
} else {
  mongoose.connect(MONGO_URI)
    .then(()=>{ console.log('MongoDB connected'); })
    .catch(err=>{ console.error('Mongo connect error', err); });
}

if (require.main === module) {
  app.listen(PORT, ()=>{ console.log(`Server running on port ${PORT}`); });
}

module.exports = app;
