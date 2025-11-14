const Note = require('./note')

Note.sync() //crea la tabla automáticamente si no existe

module.exports = {
    Note
}