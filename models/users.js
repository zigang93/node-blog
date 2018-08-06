const User = require('../lib/mongo').User;

module.exports = {
  // Sign Up A User
  create: function create (user) {
    return User.create(user).exec();
  },

  // Get user detail from username
  getUserByName: function getUserByName (name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec();
  }
};
