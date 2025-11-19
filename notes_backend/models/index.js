const Note = require('./note')
const User = require('./user')

User.hasMany(Note) //un usuario puede tener muchas notas
Note.belongsTo(User) //una nota solo puede ser de un usuario
Note.sync( { alter: true } ) //crea la tabla automáticamente si no existe y con el alter la actualiza
User.sync( { alter: true } )

module.exports = {
    Note,
    User
}