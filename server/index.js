const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');

require('./config/env');
require('./database');

const routes = require('./routes/index');

const assetFolder = path.resolve(__dirname, '../dist/');
const port = process.env.PORT;
const app = express();

app.use(express.static(assetFolder));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
