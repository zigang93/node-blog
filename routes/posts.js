const express = require('express');
const router = express.Router();
const PostModel = require('../models/posts');

const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts , all blog article from users
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  const author = req.query.author;

  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      });
    })
    .catch(next);
});

// POST /posts/create , post a article
router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;

  // check value
  try {
    if (!title.length) {
      throw new Error('Please write the titile');
    }
    if (!content.length) {
      throw new Error('Please write the content');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  let post = {
    author: author,
    title: title,
    content: content
  };

  PostModel.create(post)
    .then(function (result) {
      post = result.ops[0];
      req.flash('success', 'Publish Success');
      // after success publish, redirect to published article page
      res.redirect(`/posts/${post._id}`);
    })
    .catch(next);
});

// GET /posts/create , publish a article
router.get('/create', checkLogin, function (req, res, next) {
  res.render('create');
});

// GET /posts/:postId , article detail page
router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId;

  Promise.all([
    PostModel.getPostById(postId), // get post id
    PostModel.incPv(postId)// post view + 1
  ])
    .then(function (result) {
      const post = result[0];
      if (!post) {
        throw new Error('Article Not Found');
      }

      res.render('post', {
        post: post
      });
    })
    .catch(next);
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
