const User = require('../lib/mongo').User;

module.exports = {
  // Sign Up A User
  create: function create (user) {
    return User.create(user).exec();
  }
};
