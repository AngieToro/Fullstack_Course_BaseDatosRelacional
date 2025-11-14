const router = require('express').Router()

const { Blog } = require('../models')

//middleware que busca el blog en la base de datos 
const blogFinder = async(req, res, next) => {
    
    console.log('Blog id: ', req.params.id);
    req.blog = await Blog.findByPk(req.params.id)

    if (!req.blog){
        const error = new Error('Blog not found')
        error.status = 404
        return next(error)
    }

    console.log('Blog found: ', req.blog);
    next()
}

//Busca todos los elementos
router.get('/', async (req, res) => {
    
    const blogs = await Blog.findAll()
    //console.log('Blogs: ', blogs)

    blogs.forEach( blog => {
        console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    })

    res.status(200).json(blogs)
})

//Busca un solo elemento
router.get('/:id', blogFinder, async (req, res) => {

    console.log('Blog: ', JSON.stringify(req.blog,null,2))
    res.status(200).json(req.blog)  
})

//Se agrega un elemento
//el error lo detecta el middleware
router.post('/', async (req, res) => {
    
    console.log('Blog body to create: ', req.body)

    try {
        const blog = Blog.build(req.body)
        await blog.save()
        res.status(201).json(blog)
    } catch (error) {
        next(error)
    }
})

//Se modifica un elemento
router.put('/:id', blogFinder, async (req, res) => {

    console.log('Blog: body to update: ', req.body)
    
    try {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.status(200).json(req.blog)
    } catch (error) {
        next(error)
    }
})

//Se elimina un elemento
router.delete('/:id', blogFinder, async (req, res, next) => {

    try {
        const deleteBlog = req.blog
        await req.blog.destroy()
        res.status(200).json(deleteBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = router