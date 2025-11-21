const { DataTypes } = require('sequelize')

module.exports = {
    //indica cómo modificar la BD cuando se realiza la migración
    //las validaciones solo funcionan en los modelos, no en migraciones
    up: async( { context: queryInterface } ) => {
        //crea la tabla de blogs
        await queryInterface.createTable('blogs', {
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
            allowNull: false
          },
          title: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          likes: {
            type: DataTypes.INTEGER
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
          }
        })
        //crea la tabla de users
        await queryInterface.createTable('users', {
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
          password_hash: {
            type: DataTypes.STRING,
            allowNull: false
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              isAlpha: true //solo acepta caracteres
            }
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
          }
        })
        //agrega una clave foranea (externa) a los blogs que hace referencia al creador (usuario) de la nota
        await queryInterface.addColumn('blogs','user_id',{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model:'users',  key:'id'}
        })
    },
    //indica cómo deshacer la migración
    down: async ( { context: queryInterface } ) => {
        await queryInterface.dropTable('blogs')
        await queryInterface.dropTable('users')
    },
}