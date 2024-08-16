const path = require('path');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('./config/env');
require('./database');

const routes = require('./routes/index');
const authRoutes = require('./routes/auth');

const assetFolder = path.resolve(__dirname, '../dist/');
const port = process.env.PORT;
const app = express();

app.use(express.static(assetFolder, { index: false }));
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.authenticate('session'));

app.use('/auth', authRoutes);
app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));