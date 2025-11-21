const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectedDataBase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const teamRouter = require('./controllers/teams')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/teams', teamRouter)

const start = async() => {
    await connectedDataBase()

    app.listen(PORT, () => {
        console.log(`Server running on port ${ PORT } `);
    })
}

start()