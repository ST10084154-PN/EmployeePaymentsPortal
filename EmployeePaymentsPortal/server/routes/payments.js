const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const logger = require('../logger');
const router = express.Router();

router.get('/balance', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json({ balance: user.balance, email: user.email, username: user.username });
  } catch (err) {
    logger.error('Balance error', { err: err.message });
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/transfer', [
  body('recipientEmail').isEmail(),
  body('amount').isFloat({ min: 0.01 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { recipientEmail, amount } = req.body;
  try {
    const sender = await User.findById(req.user.id);
    if (!sender) return res.status(404).json({ msg: 'Sender not found' });
    if (sender.balance < amount) return res.status(400).json({ msg: 'Insufficient funds' });

    const recipient = await User.findOne({ email: recipientEmail });
    if (recipient) {
      recipient.balance += amount;
      await recipient.save();
    }
    sender.balance -= amount;
    await sender.save();

    const transaction = new Transaction({ sender: sender._id, recipientEmail, amount });
    await transaction.save();

    logger.info('Transfer', { sender: sender.email, recipientEmail, amount });
    return res.json({ msg: 'Transfer successful', transaction });
  } catch (err) {
    logger.error('Transfer error', { err: err.message });
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
