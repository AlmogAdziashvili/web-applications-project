
const express = require('express');
const { getStockData } = require('../services/twelve_data.js');
const Portfolio = require('../database/portfolio.js');

const router = express.Router();

router.get('/:id/value', async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id).populate('stocks.stock');
  const [value, yesterdayValue] = (await Promise.all(portfolio.stocks.map(async (holding) => {
    const { timeSeries } = await getStockData(holding.stock.symbol);
    if (!timeSeries) {
      return 0;
    }
    const lastClose = timeSeries[0].close;
    const yesterdayClose = timeSeries[1].close;
    return [lastClose * holding.quantity, yesterdayClose * holding.quantity];
  }))).reduce((acc, value) => ([acc[0] + value[0], acc[1] + value[1]]), [0, 0])
      
  return res.json([value, yesterdayValue]);
});

router.get('/:id/timeSeries', async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id).populate('stocks.stock');
  const timeSeries = await Promise.all(portfolio.stocks.map(async (holding) => {
    const { timeSeries } = await getStockData(holding.stock.symbol);
    return [holding.stock.symbol, timeSeries];
  }));
  return res.json(Object.fromEntries(timeSeries));
});

router.get('/:id', async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id).populate('stocks.stock').populate('user');
  return res.json(portfolio);
});

router.get('/', async (_, res) => {
  const portfolios = await Portfolio.find().populate('user').populate('stocks.stock');
  return res.json(portfolios);
});

module.exports = router;
