const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { Note, User } = require('../models');
const { SECRET } = require('../util/config');

//middleware que busca la nota de la base de datos 
const noteFinder = async(req, res, next) => {
    console.log('Note id: ', req.params.id);
    req.note = await Note.findByPk(req.params.id)
    console.log('Note found: ', req.note);
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

    const where = {}
    /* let important = {
        [Op.in]: [true, false]
    } */

    if ( req.query.important ){
        where.important = req.query.important === "true"
    }

    if ( req.query.search ){
        where.content = { [Op.substring]: req.query.search }
    }

    console.log('Where? ', where);
    
    //const notes = await Note.findAll()
    const notes = await Note.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: [ 'name','username' ]
        },
        where
    })
    //console.log('Notes: ', notes.toJSON())
    //console.log( notes.map ( note => note.toJSON()))
    console.log('Notes: ', JSON.stringify(notes, null, 2))
    
    res.status(200).json(notes)
})

//Busca un solo elemento
router.get('/:id', noteFinder, async (req, res) => {

    if (req.note) {
        console.log('Note: ', JSON.stringify(req.note,null,2))
        res.status(200).json(req.note)
    } else {
        res.status(404).end()
    }
})

//Se agrega un elemento
router.post('/', tokenExtractor, async (req, res) => {
    console.log('Note body to create: ', req.body)

    try {
        const user = await User.findByPk(req.decodedToken.id)
        console.log('User found to add in a note: ', user.name)
        
        const note = Note.build( {
            ...req.body,
            date: new Date()
        })
        note.userId = user.id
        await note.save()
        console.log('Note to add: ', note)
        
        res.status(200).json(note)

    } catch (error) {
        console.error('Error: ', error)
        res.status(400).json( { error } )
    }
})

//Se modifica un elemento
router.put('/:id', noteFinder, async (req, res) => {

    console.log('Note body to update: ', req.body);

    if (req.note){      
        req.note.important = req.body.important
        await req.note.save()
        return res.status(200).json(req.note)
    } else {
        res.status(404).end()
    }
})

//Se elimina un elemento
router.delete('/:id', noteFinder, async (req, res) => {

    if (req.note){
        await req.note.destroy()
    }

    return res.status(204).end()
})

module.exports = router