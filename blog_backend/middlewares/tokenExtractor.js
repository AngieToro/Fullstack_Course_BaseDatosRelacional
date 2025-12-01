const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config');
const { Session, User } = require('../models')

// Middleware reutilizable para verificar el token del usuario conectado
const tokenExtractor = async (req, res, next) => { 

    const authorization = req.get('authorization')  

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'token missing' })
    }

    const token = authorization.substring(7)
    console.log('Token: ', authorization)  

    try {
        req.decodedToken = jwt.verify(token, SECRET)
        console.log('Decoked token: ', req.decodedToken)

        const session = await Session.findOne({
            where: { token }
        })

        if (!session){
            return res.status(401).json({ error: 'Session expired or invalid'})
        }

        const user = await User.findByPk(req.decodedToken.id)
        console.log('User found in session:', user.username)

        if (user.disabled){
            return res.status(403).json({ error: 'User is disabled'})
        }

        req.user = user
        req.token = token

        next()
            
    } catch (error) {
        console.log('JWT Error:', error)
        return res.status(401).json({ error: 'Token invalid'})
    }    
}

module.exports = {
    tokenExtractor
}