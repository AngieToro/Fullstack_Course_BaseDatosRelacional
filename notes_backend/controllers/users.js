const router = require('express').Router()
const { tokenExtractor } = require('../middlewares/tokenExtractor')

const { User, Note, Team } = require('../models')

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)

    if (!user.admin){
        return res.status(401).json({ 
            error: 'peration not allowed'
        })
    }

    next()
}

//Busca todos los elementos
router.get('/', async (req, res) => {
    //const users = await User.findAll()
    //incluya en la consulta de user cuales son sus notas
    const users = await User.findAll({
        include: [
            {
                model: Note,
                attributes: { exclude: [ 'userId' ] }
            },
            {
                model: Team,
                attributes: [ 'id', 'name' ],
                through: {
                    attributes: []  //quita la relacion con membership
                }
            }
        ]
    })
    console.log('Users: ', JSON.stringify(users, null, 2))
    
    res.status(200).json(users)
})

//Busca un solo elemento
router.get('/:id', async (req, res) => {

    console.log('User id: ', req.params.id)
    const user = await User.findByPk(req.params.id, {
        include: [
            {   //sus propias notas
                model: Note,
                attributes: { exclude: ['userId'] },
            },
            {   //notas marcadas por el usuario
                model: Note,
                as: 'marked_notes',
                attributes: { exclude: ['userId'] },
                through: {
                    attributes: []
                },
                include: {
                    model: User,
                    attributes: ['name']
                }
            },
            {
                model: Team,
                through: {
                    attributes: []
                }
            }
        ]
    })

    console.log('User found: ', user)
    user.teams.forEach(element => {
      console.log('Team user: ', element.name)
        
    })

    if (user) {
        console.log('User: ', JSON.stringify(user,null,2))
        res.status(200).json(user)
        /* res.status(200).json({
            username: user.username,
            name: user.name,
            notes: user.notes.length,
            teams: user.teams.length
        }) */

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

//Se modifican un elemento
router.put('/:id/admin', async (req, res) => {

    console.log('User body to update: ', req.body);

    console.log('User id: ', req.params.id)
    const user = await User.findByPk(req.params.id)
    console.log('User found to update: ', user);

    if (!user) return res.status(404).end()

    user.admin = req.body.admin
    await user.save()
    
    return res.status(200).json(user)
    
})

router.put('/:username/disabled', tokenExtractor, isAdmin, async (req, res) => {

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