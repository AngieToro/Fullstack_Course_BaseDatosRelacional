const { DataTypes } = require('sequelize')

module.exports = {
    //indica cómo modificar la BD cuando se realiza la migración
    up: async( { context: queryInterface } ) => {
        await queryInterface.addColumn('sessions','created_at',{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }),
        await queryInterface.addColumn('sessions','updated_at',{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        })
    },
    //indica cómo deshacer la migración
    down: async ( { context: queryInterface } ) => {
        await queryInterface.removeColumn('sessions','reated_at'),
        await queryInterface.removeColumn('sessions','updated_at')
    },
}