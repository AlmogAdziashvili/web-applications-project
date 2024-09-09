const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  stocks: {
    type: String,
    required: true
  },
});

const PortfolioModel = mongoose.model('portfolio', PortfolioSchema);
module.exports = PortfolioModel;