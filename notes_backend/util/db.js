const Sequelize = require('sequelize')
const { DATABASE_URL, NODE_ENV } = require('./config')

const useSSL = NODE_ENV === 'prod'

const sequelize = new Sequelize(DATABASE_URL, {
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

const connectedDataBase = async() => {
    try {
        await sequelize.authenticate()
        console.log('Connected to the database')
    } catch (error) {
        console.log('Failed to connected to the database')
        return process.exit(1)
    }
    
    return null
}

module.exports = {
    connectedDataBase, 
    sequelize
}