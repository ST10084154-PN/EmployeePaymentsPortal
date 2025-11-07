const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../logger');
const bcrypt = require('bcrypt');
const router = express.Router();

const MAX_FAILED = 5;
const LOCKOUT_MINUTES = 15;

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (user.lockUntil && user.lockUntil > Date.now()) {
      logger.warn('Locked login attempt', { email });
      return res.status(403).json({ msg: 'Account locked. Try again later.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED) {
        user.lockUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
        await user.save();
        logger.warn('Account locked', { email });
        return res.status(403).json({ msg: 'Account locked due to multiple failed attempts.' });
      }
      await user.save();
      logger.warn('Failed login', { email });
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info('User logged in', { email: user.email });
    res.json({ token });
  } catch (err) {
    logger.error('Login error', { err: err.message });
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
