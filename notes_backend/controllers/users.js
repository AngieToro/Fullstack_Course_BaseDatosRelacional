const router = require('express').Router()

const { User, Note } = require('../models')

//Busca todos los elementos
router.get('/', async (req, res) => {
    //const users = await User.findAll()
    //incluya en la consulta de user cuales son sus notas
    const users = await User.findAll({
        include: {
            model: Note,
            attributes: { exclude: [ 'userId' ] }
        }
    })
    console.log('Users: ', JSON.stringify(users, null, 2))
    
    res.status(200).json(users)
})

//Busca un solo elemento
router.get('/:id', async (req, res) => {

    console.log('User id: ', req.params.id)
    const user = await User.findByPk(req.params.id)
    console.log('User found: ', user);
    
    if (user) {
        console.log('User: ', JSON.stringify(user,null,2))
        res.status(200).json(user)
    } else {
        res.status(404).end()
    }
})

//Se agrega un elemento
router.post('/', async (req, res) => {
    console.log('User body to create: ', req.body)

    try {
        const user = await User.create(req.body)
        res.status(200).json(user)
    } catch (error) {
        console.error('Error: ', error);
        res.status(400).json( { error } )
    }
})

/* //Se modifica un elemento
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
}) */

module.exports = router