const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// GET /signout , Sign Out
router.get('/', checkLogin, function (req, res, next) {
  // Clear session user info
  req.session.user = null;
  req.flash('success', 'Success Sign Out');
  // After Sign Out, redirect to home page.
  res.redirect('/posts');
});

module.exports = router;
