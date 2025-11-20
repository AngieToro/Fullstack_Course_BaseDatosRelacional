const { DataTypes } = require('sequelize')

module.exports = {
    //indica cómo modificar la BD cuando se realiza la migración
    up: async( { context: queryInterface } ) => {
        await queryInterface.addColumn('users','admin',{
            type: DataTypes.BOOLEAN,
            default: false
        })
        await queryInterface.addColumn('users','disabled',{
            type: DataTypes.BOOLEAN,
            default: false
        })
    },
    //indica cómo deshacer la migración
    down: async ( { context: queryInterface } ) => {
        await queryInterface.removeColumn('users','admin')
        await queryInterface.removeColumn('users','disabled')
    },
}