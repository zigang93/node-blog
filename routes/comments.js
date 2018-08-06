const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

// POST /comments, post a comment
router.post('/', checkLogin, function (req, res, next) {
  res.send('Create Comments');
});

// GET /comments/:commentId/remove , remove a comment
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
  res.send('Remove Comments');
});

module.exports = router;
