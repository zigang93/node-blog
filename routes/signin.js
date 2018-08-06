const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin , User Sign In
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('Sign In Page');
});

// POST /signin , User Login
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('Sign In');
});

module.exports = router;
