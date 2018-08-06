const marked = require('marked');
const Post = require('../lib/mongo').Post;

// convert post content to html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
});

module.exports = {
  // create a article
  create: function create (post) {
    return Post.create(post).exec();
  },

  // get post by id
  getPostById: function getPostById (postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  // get all article list from author
  getPosts: function getPosts (author) {
    const query = {};
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  // thru post id , give post view + 1
  incPv: function incPv (postId) {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } })
      .exec();
  },

  // get raw post by id
  getRawPostById: function getRawPostById (postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec();
  },

  // update post by id
  updatePostById: function updatePostById (postId, data) {
    return Post.update({ _id: postId }, { $set: data }).exec();
  },

  // delete post by id
  delPostById: function delPostById (postId) {
    return Post.deleteOne({ _id: postId }).exec();
  }
};
