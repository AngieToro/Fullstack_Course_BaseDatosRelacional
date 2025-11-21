const { DataTypes } = require('sequelize')

module.exports = {
    //indica cómo modificar la BD cuando se realiza la migración
    up: async( { context: queryInterface } ) => {
        await queryInterface.addColumn('blogs','year',{
            type: DataTypes.INTEGER,
            allowNull: false
        })
    },
    //indica cómo deshacer la migración
    down: async ( { context: queryInterface } ) => {
        await queryInterface.removeColumn('blogs','year')
    },
}