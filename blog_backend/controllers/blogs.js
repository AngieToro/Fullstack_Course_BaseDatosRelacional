const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../middlewares/tokenExtractor')

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

const yearValidation = (req, res, next) => { 

    const year = req.body.year 
    const currentYear = new Date().getFullYear()

    if (year < 1991 || year > currentYear) {
        return res.status(400).json({
            error: `Year must be between 1991 and ${ currentYear }`
        })
    }

    next()
}

//Busca todos los elementos
router.get('/', async (req, res) => {
    
    const where = {}

    if ( req.query.search ){
        where[Op.or] = [
            { title: { [Op.substring]: req.query.search } },
            { author: { [Op.substring]: req.query.search } }
        ]      
    }

    console.log('Where? ', where);

    //const blogs = await Blog.findAll()
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId']},
        include: {
            model: User,
            attributes: [ 'name', 'username']
        },
        where, 
        order: [['likes', 'DESC']]
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
router.post('/',tokenExtractor, yearValidation, async (req, res) => {
    
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
router.put('/:id', blogFinder, yearValidation, async (req, res) => {

    console.log('Blog body to update: ', req.body)
    
    try {
        req.blog.likes = req.body.likes
        req.blog.year = req.body.year
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