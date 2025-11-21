require('express-async-error')
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectedDataBase } = require('./util/db')
const errorHandler = require('./middlewares/errorHandler') 

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingList = require('./controllers/readingList')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingList)

app.use(errorHandler)

const start = async() => {
    await connectedDataBase()

    app.listen(PORT, () => {
        console.log(`Server running on port ${ PORT } `);
    })
}

start()