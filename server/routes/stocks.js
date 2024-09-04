
const path = require('path');
const express = require('express');

const Stock = require('../database/stock.js');

const router = express.Router();

router.get('/', async (req, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
});

module.exports = router;
