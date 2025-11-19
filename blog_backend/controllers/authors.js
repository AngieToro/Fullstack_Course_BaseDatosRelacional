const router = require('express').Router()
const { fn, col } = require('sequelize')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
    
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [ fn('COUNT', col('author')), 'articles' ],
            [ fn('SUM', col('likes')), 'likes']
        ],
        group: 'author',
        order: [['likes']]
    })

    console.log('Authors: ', authors)

    res.status(200).json(authors)
})

module.exports = router