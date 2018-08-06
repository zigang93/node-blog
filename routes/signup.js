const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup , Sign Up Pages
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('Sign Up Pages');
});

// POST /signup , User Sign Up
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('User Sign Up');
});

module.exports = router;
