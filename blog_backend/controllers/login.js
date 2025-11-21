const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET, SALT_ROUNDS } = require('../util/config')
const User = require('../models/user')

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

    const token = jwt.sign(userForToken, SECRET)

    res.status(200).send({
        token,
        username: user.username,
        name: user.name
    })
})

module.exports = router