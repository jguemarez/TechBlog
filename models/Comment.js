const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    blogger_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'blogger',
        key: 'id',
        unique: false
      },
    },
    blog_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'blog_post',
          key: 'id',
          unique: false
        },
      },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
