const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockHoldingSchema = new Schema({
  stock: {
    type: 'ObjectId',
    ref: 'stock',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const PortfolioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: 'ObjectId',
    ref: 'user',
  },
  stocks: [StockHoldingSchema],
});

const PortfolioModel = mongoose.model('portfolio', PortfolioSchema);
module.exports = PortfolioModel;