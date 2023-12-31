const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Blogger extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

Blogger.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newBloggerData) => {
        newBloggerData.password = await bcrypt.hash(newBloggerData.password, 10);
        return newBloggerData;
      },
      beforeUpdate: async (updatedBloggerData) => {
        updatedBloggerData.password = await bcrypt.hash(updatedBloggerData.password, 10);
        return updatedBloggerData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'blogger',
  }
);

module.exports = Blogger;
