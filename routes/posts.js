const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts , all blog article from users
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  res.send('Home');
});

// POST /posts/create , post a article
router.post('/create', checkLogin, function (req, res, next) {
  res.send('Create Article');
});

// GET /posts/create , publish a article
router.get('/create', checkLogin, function (req, res, next) {
  res.send('Publish Article');
});

// GET /posts/:postId , article detail page
router.get('/:postId', function (req, res, next) {
  res.send('Article Detail Pages');
});

// GET /posts/:postId/edit , refresh article detail page
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('Refresh Article Detail Pages');
});

// POST /posts/:postId/edit , update article detail page
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('Update Article Detail Pages');
});

// GET /posts/:postId/remove , remove article page
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('Delete Article');
});

module.exports = router;
