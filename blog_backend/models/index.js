const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const Session = require('./sessions')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as:'readings' } )
Blog.belongsToMany(User, { through: ReadingList } )

User.hasMany(Session)
Session.belongsTo(User)


//Blog.sync({ alter: true })
//User.sync({ alter: true })

module.exports = {
    Blog,
    User,
    ReadingList,
    Session
}