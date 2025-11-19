const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (req, res ) => {

    console.log('User body to login: ', req.body)
    
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    })

    console.log('User found: ', user);

    //contraseña cableada secret para todos los usuarios)
    const passwordCorrect = req.body.password === 'secret'

    if (!(user && passwordCorrect)){
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    res.status(200).send({
        token,
        username: user.username,
        name: user.name
    })
})

module.exports = router