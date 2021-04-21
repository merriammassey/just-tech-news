const User = require('./User');
const Post = require('./Post')

// create associations between posts and users
User.hasMany(Post, {
    foreignKey: 'user_id'
  });

module.exports = { User, Post };