const bcrypt = require('bcrypt')
const router = require('express').Router()
const { SALT_ROUNDS} = require('../util/config')
const { tokenExtractor } = require('../middlewares/tokenExtractor')

const { User, Blog, ReadingList } = require('../models')

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    console.log('User admin: ', isAdmin)
    
    if (!user.admin){
        return res.status(401).json({ 
            error: 'Operation not allowed'
        })
    }

    next()
}

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

    const userId = req.params.id
    const read = req.query.read

    console.log('User id: ', userId)
    console.log('Read: ', read)

    const where = {}

    if ( read === 'true'){
        where.status = 'read'
    }

    if ( read === 'false'){
        where.status = 'unread'
    }

    const user = await User.findByPk(userId, {
        attributes: [ 'name', 'username' ],
        include: { //lista de lectura del usuario
            model: Blog,
            as: 'readings',
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
            through: {
                attributes: ['id','status'],
                where
            }
        }
    })

    if (!user) return  res.status(404).end()

    console.log('User: ', JSON.stringify(user,null,2))
    res.status(200).json(user)
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

    console.log('User body to update: ', req.body)

    if (!user) {
        console.error('Error: ', error)
        return res.status(404).end()
    }

    user.username = req.body.username
    await user.save()
    return res.status(200).json(user)
   
})

router.put('/admin/:id', async (req, res) => {

    console.log('User body to update: ', req.body)

    console.log('User id: ', req.params.id)
    const user = await User.findByPk(req.params.id)
    console.log('User found: ', user);

    if (!user) {
        console.error('Error: ', error)
        return res.status(404).end()
    }

    user.admin = req.body.admin
    await user.save()
    return res.status(200).json(user)
})

router.put('/disabled/:username', tokenExtractor, isAdmin, async (req, res) => {

    console.log('User body to update: ', req.body);

    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    console.log('User found to update: ', user);

    if (!user) return res.status(404).end()

    user.disabled = req.body.disabled
    await user.save()

    return res.status(200).json(user)
})

module.exports = router