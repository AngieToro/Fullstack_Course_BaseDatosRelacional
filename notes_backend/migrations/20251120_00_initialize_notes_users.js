const { DataTypes } = require('sequelize')

module.exports = {
    //indica cómo modificar la BD cuando se realiza la migración
    up: async( { context: queryInterface } ) => {
        //crea la tabla de notes
        await queryInterface.createTable('notes', {
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
                /* created_at: {
                  allowNull: false,
                  type: DataTypes.DATE,
                  defaultValue: DataTypes.NOW
                },
                updated_at: {
                  allowNull: false,
                  type: DataTypes.DATE,
                  defaultValue: DataTypes.NOW
                } */
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
                },
                name: {
                  type: DataTypes.STRING,
                  allowNull: false,
                },
                /* created_at: {
                  allowNull: false,
                  type: DataTypes.DATE,
                  defaultValue: DataTypes.NOW
                },
                updated_at: {
                  allowNull: false,
                  type: DataTypes.DATE,
                  defaultValue: DataTypes.NOW
                } */
        })
        //agrega una clave foranea (externa) a las notas que hace referencia al creador (usuario) de la nota
        await queryInterface.addColumn('notes','user_id',{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model:'users',  key:'id'}
        })
    },
    //indica cómo deshacer la migración
    down: async ( { context: queryInterface } ) => {
        await queryInterface.dropTable('notes')
        await queryInterface.dropTable('users')
    },
}