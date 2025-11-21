const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db')

class ReadingList extends Model {}

  ReadingList.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'unread',
      validate: {
        isIn: {
          args: [['read', 'unread']],
          msg: 'Status must be read or unread'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading_list'
  }
)

module.exports = ReadingList;