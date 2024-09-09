
const express = require('express');
const mongoose = require('mongoose');
const { requireAdmin } = require('../middleware/auth.js');

const Stock = require('../database/stock.js');

const router = express.Router();

router.get('/', async (_, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
});

router.put('/', [requireAdmin, async (req, res) => {
  const { name, symbol, location } = req.body;
  try {
    await Stock.findOneAndUpdate({ _id: req.body._id ?? (new mongoose.Types.ObjectId()) }, { name, symbol, location }, { upsert: true });
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
