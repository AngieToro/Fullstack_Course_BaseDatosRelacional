require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 3001,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SECRET: process.env.SECRET,
    SALT_ROUNDS: 10
}