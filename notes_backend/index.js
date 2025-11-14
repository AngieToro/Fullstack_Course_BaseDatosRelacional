const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectedDataBase } = require('./util/db')

const notesRouter = require('./controllers/notes')

app.use(express.json())

app.use('/api/notes', notesRouter)

const start = async() => {
    await connectedDataBase()

    app.listen(PORT, () => {
        console.log(`Server running on port ${ PORT } `);
    })
}

start()