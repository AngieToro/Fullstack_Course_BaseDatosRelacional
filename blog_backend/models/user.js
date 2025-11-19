const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db')

class User extends Model {}

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true  //valida formato de correo (foo@bar.com)
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'  // nombre columna en la base de datos
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true //solo acepta caracteres
      }
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user'
  }
)

module.exports = User;