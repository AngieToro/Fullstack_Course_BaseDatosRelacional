const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { Session, User } = require('../models')

router.post('/', async (req, res ) => {

    console.log('User body to login: ', req.body)
    
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    })

    if (!user){
        return res.status(401).json({
            error: 'Invalid username'
        })
    }

    console.log('User found: ', user.dataValues)

    const passwordCorrect = await bcrypt.compare(req.body.password, user.passwordHash)
    console.log('Password is correct?: ', passwordCorrect);

    if (!passwordCorrect){
        return res.status(401).json({
            error: 'Invalid password'
        })
    }

    if (user.disabled){
        return res.status(401).json({
            error: 'Account disabled, please contact admin'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    //firmar el token
    const token = jwt.sign(userForToken, SECRET)

    //crear la sesion
    await Session.create({
        token,
        userId: user.id
    })

    res.status(200).send({
        token,
        username: user.username,
        name: user.name
    })
})

router.delete('/logout', async (req, res) => {

    const authorization = req.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        console.log('Token to destroy: ', token)
        
        await Session.destroy( {
            where: { token }
        })
    }

    return res.status(204).end()

})

module.exports = router