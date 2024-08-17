function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
}

function requireNoAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function requireAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.sendStatus(401);
}

module.exports = {
  requireAuth,
  requireNoAuth,
  requireAdmin,
};