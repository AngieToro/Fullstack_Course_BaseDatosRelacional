require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const useSSL = process.env.NODE_ENV === 'prod'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

const main = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully');

        const notes = await sequelize.query(
            "SELECT * FROM notes", {
                type: QueryTypes.SELECT 
            }
        )

        console.log('Notes: ', notes);
        
        sequelize.close()
        
    } catch ( error ) {
        console.error('Unable to connect to the database: ', error);
    }
}

main()