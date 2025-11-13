const { Sequelize,DataTypes, Model } = require('sequelize');

const useSSL = process.env.NODE_ENV === 'prod'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: useSSL
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
        }
        : { },
})

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
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    likes: {
        type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  }
)

module.exports = Blog;