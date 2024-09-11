const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: 'ObjectId',
    ref: 'user',
  },
  stocks: [{
    type: 'ObjectId',
    ref: 'stock',
  }],
});

const PortfolioModel = mongoose.model('portfolio', PortfolioSchema);
module.exports = PortfolioModel;