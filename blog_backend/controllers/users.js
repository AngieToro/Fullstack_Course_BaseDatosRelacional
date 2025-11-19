const bcrypt = require('bcrypt')
const router = require('express').Router()
const { SALT_ROUNDS} = require('../util/config')

const { User, Blog } = require('../models')

//Busca todos los elementos
router.get('/', async (req, res) => {
    //const users = await User.findAll()
    const users = await User.findAll({
        include: {
            model: Blog,
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
        const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS)
        console.log('Hash: ', hash)
        
        const user = await User.create({ 
            username: req.body.username,
            passwordHash: hash,
            name: req.body.name
        })
        res.status(200).json({
            id: user.id,
            username: user.username,
            name: user.name
        })

    } catch (error) {
        console.error('Error: ', error);
        res.status(400).json( { error } )
    }
})

//Se modifica un elemento
router.put('/:id', async (req, res) => {

    console.log('User id: ', req.params.id)
    const user = await User.findByPk(req.params.id)
    console.log('User found: ', user);

    console.log('User body to update: ', req.body);

    if (user){      
        user.username = req.body.username
        await user.save()
        return res.status(200).json(user)
    } else {
        console.error('Error: ', error);
        res.status(404).end()
    }
})

module.exports = router