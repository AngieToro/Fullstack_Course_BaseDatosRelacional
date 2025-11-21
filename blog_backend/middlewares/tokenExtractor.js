const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config');

// Middleware reutilizable para verificar el token del usuario conectado
const tokenExtractor = (req, res, next) => { 
    const authorization = req.get('authorization')
    console.log('Token: ', authorization)    

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'token missing' })
    }

    const token = authorization.substring(7)

    try {
        req.decodedToken = jwt.verify(token, SECRET)
        console.log('Decoked token: ', req.decodedToken)

        next()
            
    } catch (error) {
        console.log('JWT Error:', error)
        return res.status(401).json({ error: 'Token invalid'})
    }    
}

module.exports = {
    tokenExtractor
}