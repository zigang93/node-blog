module.exports = {
  checkLogin: function checkLogin (req, res, next) {
    if (!req.session.user) {
      req.flash('error', 'Not Login Yet');
      return res.redirect('/signin');
    }
    next();
  },

  checkNotLogin: function checkNotLogin (req, res, next) {
    if (req.session.user) {
      req.flash('error', 'Already Log In');
      return res.redirect('back');// back to previous pages
    }
    next();
  }
};
