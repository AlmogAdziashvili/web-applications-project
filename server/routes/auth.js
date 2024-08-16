const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../database/user.js');
const { requireAuth, requireNoAuth } = require('../middleware/auth.js');
const router = express.Router();

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.post('/signup', requireNoAuth, (req, res) => {
  User.register(
    new User({
      username: req.body.username.toLowerCase(),
      name: req.body.name,
    }), req.body.password, function (err) {
      if (err) {
        res.send(err);
      } else {
        const user = {
          id: this.lastID,
          username: req.body.username
        };
        req.login(user, function (err) {
          if (err) { return next(err); }
          res.json({ message: 'Successful' });
        });
      }
    }
  );
});

router.post('/signin', requireNoAuth, passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Successful' });
});

router.post('/signout', requireAuth, (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/signin');
  });
});

router.get('/profile', requireAuth, async (req, res) => {
  const { isAdmin, name, username } = await User.findOne({ username: req.user.username });
  res.json({ isAdmin, name, username });
});

module.exports = router;