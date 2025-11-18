const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db')

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
    },
    //opcional, porque con el User.hasMany(Note) y Note.belongsTo(User) que esta en el index es suficiente
    //no pueden estar ambos activos
    /* userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id'}
    } */
  }, {
    sequelize,
    underscored: true,  //los nombres de las tablas se derivan de los nombres de los modelos como versiones en plural (snake case)
    timestamps: false,  //no tiene que usar las columnas de marcas de tiempo (created_at and updated_at)
    modelName: 'note'
  }
)

module.exports = Note;