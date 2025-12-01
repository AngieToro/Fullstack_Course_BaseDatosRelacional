const { Model, DataTypes, Op } = require('sequelize');
const { sequelize } = require('../util/db')
const Note = require('./note')

//sencillo sin utilizar Note
// class User extends Model {}
class User extends Model {
  
  //metodo de instancia 
  //Se utiliza sobre un objeto específico 
  //útil para modificar o consultar datos del objeto específico
  async number_of_notes() {
    return (await this.getNotes()).length
  }

  //metodo de clase (static)
  //Se define usando Model directamente, por ejemplo: User.findAll()
  //útil para hacer operaciones generales (buscar, crear o contar registros)
  //el limit indica el mínimo de notas que un usuario debe tener para ser incluido en el resultado
  static async with_notes(limit){
    return await User.findAll({
      attributes: {
        include: [ [ sequelize.fn("COUNT", sequelize.col("notes.id")), "note_count"] ]
      },
      include: [
        {
          model: Note,
          attributes: []
        },
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(notes.id) > ${limit}`)
    })
  }
}

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
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user',
    defaultScope:{
      where:{
        disabled: false //a las consultas se excluyen los usuarios disabled 
      }
    },
    scopes:{
      admin: {
        where:{
          admin: true
        }
      },
      disabled: {
        where: {
          disabled: true
        }
      },
      name(value){
        return {
          where: {
            name:{
              [Op.iLike]: value
            }
          }
        }
      }
    }
  }
)

module.exports = User;