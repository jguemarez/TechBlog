// Import the Sequelize models
const BlogPost = require('./BlogPost');
const Blogger = require('./Blogger');
const Comment = require('./Comment');

// Defining the one-to-many relation between the tables corresponding to Blogger (source) and BlogPost (target)
Blogger.hasMany(BlogPost, {
  foreignKey: 'blogger_id',
  onDelete: 'CASCADE'
});

BlogPost.belongsTo(Blogger, {
  foreignKey: 'blogger_id',
});

Blogger.hasMany(Comment, {
    foreignKey: 'blogger_id',
    unique: false,
    onDelete: 'CASCADE'
});

  
Comment.belongsTo(Blogger, {
    foreignKey: 'blogger_id',
    unique: false
});

//Defining the many-to-many relation between the tables corresponding to BlogPost and Tag

BlogPost.hasMany(Comment, {
    foreignKey: 'blog_post_id',
    unique: false,
    onDelete: 'CASCADE'
});

Comment.belongsTo(BlogPost, {
    foreignKey: 'blog_post_id',
    unique: false
});

module.exports = {
  BlogPost,
  Blogger,
  Comment
};
