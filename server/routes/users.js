
const path = require('path');
const express = require('express');

const { requireAdmin } = require('../middleware/auth.js');
const User = require('../database/user.js');

const router = express.Router();

router.get('/', requireAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.put('/:username', requireAdmin, async (req, res) => {
  const { username } = req.params;
  const { isAdmin } = req.body;
  if (req.user.username === username) {
    return res.status(403).send('You cannot change your own admin status');
  }

  const user = await User.findOne({ username });
  user.isAdmin = isAdmin;
  await user.save();

  res.sendStatus(200);
});

module.exports = router;
