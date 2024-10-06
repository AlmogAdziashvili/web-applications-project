const path = require('path');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('./config/env');
require('./database');

const routes = require('./routes/index');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const stocksRoute = require('./routes/stocks');
const portfoliosRoute = require('./routes/portfolios');

const assetFolder = path.resolve(__dirname, '../dist/');
const port = 3000;
const app = express();

app.use(express.static(assetFolder, { index: false }));
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'Haim', resave: false, saveUninitialized: false }));
app.use(passport.authenticate('session'));

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/stocks', stocksRoute);
app.use('/api/portfolios', portfoliosRoute);
app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));