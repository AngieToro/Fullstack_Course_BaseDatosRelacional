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

class Note extends Model {}

  Note.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
        type: DataTypes.DATE,
    }
  }, {
    sequelize,
    underscored: true,  //los nombres de las tablas se derivan de los nombres de los modelos como versiones en plural (snake case)
    timestamps: false,  //no tiene que usar las columnas de marcas de tiempo (created_at and updated_at)
    modelName: 'note'
  }
)

module.exports = Note;