const errorHandler = (err, req, res, next) => {
    
    console.error('Error capturado por middleware:', err.message)

    //Si el error proviene de Sequelize y es una validación 
    //por ejemplo un campo requerido faltante
    if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map( error = `${error.path}: ${error.message}`)
        return res.status(400).json({ errors: validationErrors })
    }

    //Si el error es de base de datos 
    //por ejemplo esquema inválido, constraint violada, etc
    if (err.name === 'SequelizeDatabaseError') {
        return res.status(400).json({ error: 'Database error: ' + err.message })
    }

    // Si es un tipo de error JavaScript como TypeError
    if (err.name === 'TypeError') {
        return res.status(400).json({ error: 'Type error: ' + err.message })
    }

    //Si ninguno de los anteriores coincide, se trata como error inesperado
    return res.status(500).json({ error: 'Internal server error' })
}

module.exports = errorHandler