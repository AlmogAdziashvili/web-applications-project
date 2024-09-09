
const express = require('express');
const mongoose = require('mongoose');
const { requireAdmin } = require('../middleware/auth.js');

const Portfolio = require('../database/portfolio.js');

const router = express.Router();

router.get('/', async (_, res) => {
  const portfolios = await Portfolio.find();
  res.json(portfolios);
});

module.exports = router;
