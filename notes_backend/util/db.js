const Sequelize = require('sequelize')
const { DATABASE_URL, NODE_ENV } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

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

//se ejecuta cada vez que la aplicación abre una conexión de base de datos cuando se inicia
//Sequelize realiza un seguimiento de las migraciones que ya se han completado, por lo que si no hay nuevas migraciones, ejecutar la función runMigrations no hace nada
const migrationConf = {
    migrations: {
        glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage( { sequelize, tableName: 'migrations' } ),
    context: sequelize.getQueryInterface(),
    logger: console,
}
const runMigrations = async() => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map( mig => mig.name )
    })
}

const rollbackMigration = async () => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConf)
    await migrator.down()
}

const connectedDataBase = async() => {
    try {
        await sequelize.authenticate()
        await runMigrations()
        console.log('Connected to the database')
    } catch (error) {
        console.log('Failed to connected to the database')
        return process.exit(1)
    }
    
    return null
}

module.exports = {
    connectedDataBase, 
    sequelize,
    rollbackMigration
}