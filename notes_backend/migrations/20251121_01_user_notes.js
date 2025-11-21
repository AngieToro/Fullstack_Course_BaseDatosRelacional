const { DataTypes } = require('sequelize')

module.exports = {
    //indica cómo modificar la BD cuando se realiza la migración
    up: async( { context: queryInterface } ) => {
        await queryInterface.createTable('user_notes', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
          },
          note_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'notes', key: 'id' },
          }
        })
    },
    //indica cómo deshacer la migración
    down: async ( { context: queryInterface } ) => {
        await queryInterface.dropTable('user_notes')
    },
}