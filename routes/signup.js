const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup , Sign Up Pages
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup');
});

// POST /signup , User Sign Up
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name;
  const gender = req.fields.gender;
  const bio = req.fields.bio;
  const avatar = req.files.avatar.path.split(path.sep).pop();
  let password = req.fields.password;
  const repassword = req.fields.repassword;

  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('Name input maximum 10 characters');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('Gender only allow m, f or x');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('Bio input maximum 30 characters');
    }
    if (!req.files.avatar.name) {
      throw new Error('Missing Avatar images');
    }
    if (password.length < 6) {
      throw new Error('Password at least 6 characters');
    }
    if (password !== repassword) {
      throw new Error('Password not match with repeated password');
    }
  } catch (e) {
    // Sign Up fail，async delete uploaded images
    fs.unlinkSync(req.files.avatar.path);
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  // encode to password
  password = sha1(password);

  // user detail to database
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  };

  // insert user data to database
  UserModel.create(user)
    .then(function (result) {
      // store user value include _id
      user = result.ops[0];
      // delete sensetive info, save user info into session
      delete user.password;
      req.session.user = user;
      // triggle flash msg
      req.flash('success', 'Sign Up Success');
      // redirect to home pages
      res.redirect('/posts');
    })
    .catch(function (e) {
      // Sign up fail, async delete uploaded images
      fs.unlinkSync(req.files.avatar.path);
      // return to sign up page when username is exist，not return to error page.
      if (e.message.match('duplicate key')) {
        req.flash('error', 'Username had been used');
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;
