const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config');

//middleware que busca el blog en la base de datos 
const blogFinder = async(req, res, next) => {
    
    console.log('Blog id: ', req.params.id);
    req.blog = await Blog.findByPk(req.params.id)

    if (!req.blog){
        const error = new Error('Blog not found')
        error.status = 404
        return next(error)
    }

    console.log('Blog found: ', req.blog.dataValues)
    next()
}

//verificar el token del usuario conectado
const tokenExtractor = ((req, res, next) => { 
    const authorization = req.get('authorization')
    console.log('Token: ', authorization)    

    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
            console.log('Decoked token: ', req.decodedToken)
            
        } catch {
            res.status(401).json({ error: 'Token invalid'})
        }
    }
    else {
        res.status(401).json({ error: 'Token missing'})
    }

    next()
})

//Busca todos los elementos
router.get('/', async (req, res) => {
    
    //const blogs = await Blog.findAll()
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId']},
        include: {
            model: User,
            attributes: [ 'name', 'username']
        }
    })
    //console.log('Blogs: ', blogs)

    blogs.forEach( blog => {
        console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    })

    res.status(200).json(blogs)
})

//Busca un solo elemento
router.get('/:id', blogFinder, async (req, res) => {

    if (req.blog) {
        console.log('Blog: ', JSON.stringify(req.blog,null,2))
        res.status(200).json(req.blog) 
    } else {
        res.status(404).end()
    }
})

//Se agrega un elemento
//el error lo detecta el middleware
router.post('/',tokenExtractor, async (req, res) => {
    
    console.log('Blog body to create: ', req.body)

    try {
        const user = await User.findByPk(req.decodedToken.id)
        console.log('User found to add in a blog: ', user.name)

        const blog = Blog.build(req.body)
        blog.userId = user.id
        blog.likes = 0
        await blog.save()
        console.log('Blog to add: ', blog.dataValues)
        res.status(201).json(blog)
    } catch (error) {
        console.error('Error: ', error)
        next(error)
    }
})

//Se modifica un elemento
router.put('/:id', blogFinder, async (req, res) => {

    console.log('Blog body to update: ', req.body)
    
    try {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.status(200).json(req.blog)
    } catch (error) {
        next(error)
    }
})

//Se elimina un elemento
router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {

    try {

        const user = await User.findByPk(req.decodedToken.id)
        console.log('User found to delete a blog: ', user.name)

        if (!req.blog){
            res.status(404).json({ error: "Blog no encontrado"})
        }

        if (req.blog.userId === user.id){
            const deleteBlog = req.blog
            await req.blog.destroy()
            res.status(200).json(deleteBlog)
        } else {
            res.status(403).json({ error: "El blog no pertenece al usuario"})
        }
      
    } catch (error) {
        next(error)
    }
})

module.exports = router