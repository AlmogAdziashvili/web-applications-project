
const express = require('express');
const { getStockData } = require('../services/twelve_data.js');
const Portfolio = require('../database/portfolio.js');

const router = express.Router();

router.get('/:id/value', async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id).populate('stocks.stock');
  const [value, yesterdayValue] = (await Promise.all(portfolio.stocks.map(async (holding) => {
    const data = await getStockData(holding.stock.symbol);
    if (!data) {
      return 0;
    }
    const { timeSeries } = data;
    const lastClose = timeSeries[0].close;
    const yesterdayClose = timeSeries[1].close;
    return [lastClose * holding.quantity, yesterdayClose * holding.quantity];
  }))).reduce((acc, value) => ([acc[0] + value[0], acc[1] + value[1]]), [0, 0])

  return res.json([value, yesterdayValue]);
});

router.get('/:id/timeSeries', async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id).populate('stocks.stock');
  const timeSeries = await Promise.all(portfolio.stocks.map(async (holding) => {
    const data = await getStockData(holding.stock.symbol);
    if (!data) {
      return [holding.stock.symbol, []];
    }
    const { timeSeries } = data;
    return [holding.stock.symbol, timeSeries];
  }));
  return res.json(Object.fromEntries(timeSeries));
});

router.get('/my', async (req, res) => {
  const portfolios = await Portfolio.find({ user: req.user.id }).populate('stocks.stock');
  return res.json(portfolios);
});

router.get('/:id', async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id).populate('stocks.stock').populate('user');
  return res.json(portfolio);
});

router.get('/', async (_, res) => {
  const portfolios = await Portfolio.find().populate('user').populate('stocks.stock');
  return res.json(portfolios);
});

router.put('/:id', async (req, res) => {
  const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.json(portfolio);
});

router.post('/', async (req, res) => {
  const portfolio = new Portfolio(req.body);
  portfolio.user = req.user.id;
  await portfolio.save();
  return res.json(portfolio);
});

router.delete('/:id', async (req, res) => {
  await Portfolio.findByIdAndDelete(req.params.id);
  return res.status(200).send();
});

module.exports = router;
