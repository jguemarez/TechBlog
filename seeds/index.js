const sequelize = require('../config/connection');
const { Blogger, BlogPost, Comment } = require('../models');

const bloggerData = require('./bloggerData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Blogger.bulkCreate(bloggerData, {
    individualHooks: true,
    returning: true
  });

  await BlogPost.bulkCreate(postData, {returning: true});

  await Comment.bulkCreate(commentData, {returning:true});

  process.exit(0);
};

seedDatabase();