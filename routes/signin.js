const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin , User Sign In
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin');
});

// POST /signin , User Login
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name;
  const password = req.fields.password;

  // check validate
  try {
    if (!name.length) {
      throw new Error('Please write your username');
    }
    if (!password.length) {
      throw new Error('Please write your password');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        req.flash('error', 'User not exist');
        return res.redirect('back');
      }
      // check password is match
      if (sha1(password) !== user.password) {
        req.flash('error', 'Username or password wrong');
        return res.redirect('back');
      }
      req.flash('success', 'Sign in success');
      // user detail in session
      delete user.password;
      req.session.user = user;
      // redirect to home
      res.redirect('/posts');
    })
    .catch(next);
});

module.exports = router;
