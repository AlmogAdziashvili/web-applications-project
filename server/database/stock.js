const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: false
  }
});

const StockModel = mongoose.model('stock', StockSchema);
module.exports = StockModel;