const Note = require('./note')
const User = require('./user')
const Team = require('./teams')
const Membership = require('./memberships')
const UserNotes = require('./user_notes')

User.hasMany(Note) //un usuario puede tener muchas notas
Note.belongsTo(User) //una nota solo puede ser de un usuario

User.belongsToMany(Team, { through: Membership } )
Team.belongsToMany(User, { through: Membership } )

User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' } )
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' } )

//se reemplaza por el script de migracion 
//Note.sync( { alter: true } ) //crea la tabla automáticamente si no existe y con el alter la actualiza
//User.sync( { alter: true } )

module.exports = {
    Note,
    User,
    Team,
    Membership,
    UserNotes
}