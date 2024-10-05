
const express = require('express');
const mongoose = require('mongoose');
const { requireAdmin } = require('../middleware/auth.js');
const { getStockData } = require('../services/twelve_data.js');

const Stock = require('../database/stock.js');

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query, sector } = req.query;
  const findObj = {};
  if (query) {
    findObj['$or'] = [
      { name: { $regex: new RegExp(query, 'ig') } },
      { symbol: { $regex: new RegExp(query, 'ig') } },
      { location: { $regex: new RegExp(query, 'ig') } }
    ];
  }
  if (sector) {
    findObj.sector = { $regex: new RegExp(sector, 'ig') };
  }
  const stocks = await Stock.find(findObj);
  res.json(stocks);
});

router.get('/:symbol/timeSeries', async (req, res) => {
  const data = await getStockData(req.params.symbol);
  return res.json(data);
});

router.get('/:symbol', async (req, res) => {
  const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
  res.json(stock);
});

router.get('/', async (_, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
});

router.put('/', [requireAdmin, async (req, res) => {
  const { name, symbol, location, sector } = req.body;
  try {
    await Stock.findOneAndUpdate({ _id: req.body._id ?? (new mongoose.Types.ObjectId()) }, { name, symbol, location, sector }, { upsert: true });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'An error occurred' });
  }
}]);

router.delete('/:id', [requireAdmin, async (req, res) => {
  try {
    await Stock.deleteOne({ _id: req.params.id });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'An error occurred' });
  }
}]);

module.exports = router;
