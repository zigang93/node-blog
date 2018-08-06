const marked = require('marked');
const Comment = require('../lib/mongo').Comment;

// convert comment from markdown to html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content);
      return comment;
    });
  }
});

module.exports = {
  // create comment
  create: function create (comment) {
    return Comment.create(comment).exec();
  },

  // get comment by comment id
  getCommentById: function getCommentById (commentId) {
    return Comment.findOne({ _id: commentId }).exec();
  },

  // delete one comment by comment id
  delCommentById: function delCommentById (commentId) {
    return Comment.deleteOne({ _id: commentId }).exec();
  },

  // delete all comment by post id
  delCommentsByPostId: function delCommentsByPostId (postId) {
    return Comment.deleteMany({ postId: postId }).exec();
  },

  // get all comments from post id，sort by time
  getComments: function getComments (postId) {
    return Comment
      .find({ postId: postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  // get comments count
  getCommentsCount: function getCommentsCount (postId) {
    return Comment.countDocuments({ postId: postId }).exec();
  }
};
