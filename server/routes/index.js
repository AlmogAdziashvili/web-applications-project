const path = require('path');
const express = require('express');

const { requireAuth, requireNoAuth } = require('../middleware/auth.js');

const router = express.Router();

router.get(['/signin', '/signup'], requireNoAuth, (_, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'auth.html'));
});

router.get(['/', '/admin'], requireAuth, (_, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

module.exports = router;
