require('dotenv').config()
const express = require('express')
const app = express()
const BlogModel = require('./models/blogs')

app.use(express.json())

//Busca todos los elementos
app.get('/api/blogs', async (req, res) => {
    const blogs = await BlogModel.findAll()
    //console.log('Blogs: ', blogs)

    blogs.forEach( blog => {
        console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    })

    res.status(200).json(blogs)
})

//Busca un solo elemento
app.get('/api/blogs/:id', async (req, res) => {

    console.log('Blog id: ', req.params.id);
    
    const blog = await BlogModel.findByPk(req.params.id)

    if (blog){
        console.log('Blog: ', JSON.stringify(blog,null,2))
        return res.status(200).json(blog)
    } else {
        return res.status(404).end()
    }
})

//Se agrega un elemento
app.post('/api/blogs', async (req, res) => {
    console.log('Body: ', req.body)

    try {
        const blog = BlogModel.build(req.body)
        await blog.save()
        res.status(200).json(blog)
    } catch (error) {
        console.error('Error: ', error);
        return res.status(400).json( { error } )
    }
})

//Se modifica un elemento
app.put('/api/blogs/:id', async (req, res) => {

    console.log('Blog id: ', req.params.id);
    
    const blog = await BlogModel.findByPk(req.params.id)
    console.log('Blog: ', blog)

    if (blog){
        blog.likes = req.body.likes
        await blog.save()
        return res.status(200).json(blog)
    } else {
        return res.status(404).end()
    }
})

//Se elimina un elemento
app.delete('/api/blogs/:id', async (req, res) => {

    console.log('Blog id: ', req.params.id);
    
    const blog = await BlogModel.findByPk(req.params.id)
    console.log('Blog: ', blog)

    if (!blog){
        return res.status(404).end()
    }

    await blog.destroy()
    return res.status(200).json(blog)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT } `);
})