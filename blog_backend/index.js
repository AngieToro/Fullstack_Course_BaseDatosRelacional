require('express-async-error')
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectedDataBase } = require('./util/db')

const errorHandler = require('./util/middleware') 
const blogsRouter = require('./controllers/blogs')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

const start = async() => {
    await connectedDataBase()

    app.listen(PORT, () => {
        console.log(`Server running on port ${ PORT } `);
    })
}

start()