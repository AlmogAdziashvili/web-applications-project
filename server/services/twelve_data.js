const axios = require('axios');

const cache = {};

const getStockData = async (symbol) => {
  if (cache[symbol]?.lastUpdated && Date.now() - cache[symbol].lastUpdated < 1000 * 60 * 60) {
    return cache[symbol];
  }
  const options = {
    method: 'GET',
    url: 'https://twelve-data1.p.rapidapi.com/time_series',
    params: {
      symbol,
      outputsize: '7',
      interval: '1day',
      format: 'json',
    },
    headers: {
      'x-rapidapi-key': process.env.TWELVE_DATA_API_KEY,
    },
  };

  try {
    const { data: { values, meta } } = await axios.request(options);
    cache[symbol] = {
      lastUpdated: Date.now(),
      timeSeries: values,
      meta,
    };
    return cache[symbol];
  } catch (err) {
    return null;
  }
};

module.exports = {
  getStockData,
};