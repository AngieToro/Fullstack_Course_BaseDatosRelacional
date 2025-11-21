const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db')

class Blog extends Model {}

  Blog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true   //valida formato (https://foo.com)
      }
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [1991],
          msg: 'Year must be 1991 or later' 
        },
        max: {
          args: [ new Date().getFullYear() ],
          msg: 'Year cannot be greater than the current year' 
        },
        isInt: {
          msg: 'Year must be an integer (YYYY)' 
        }
      }
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog'
  }
)

module.exports = Blog;