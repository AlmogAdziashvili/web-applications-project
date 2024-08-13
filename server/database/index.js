const mongoose = require('mongoose');

const database = mongoose.connect(process.env.DATABASE_URL, {})
  .then(() => console.log('Connected to database.'))
  .catch(err => console.error('Error connecting to database:', err.message));

module.exports = database;
