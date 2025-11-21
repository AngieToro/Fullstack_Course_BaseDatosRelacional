const router = require('express').Router()
const { ReadingList, User, Blog } = require('../models')
const { tokenExtractor } = require('../middlewares/tokenExtractor')

router.post('/', async (req, res, next) => {

    console.log('ReadingList to create: ', req.body)

    try {
        
        if (!req.body.blogId || !req.body.userId) {
            return res.status(400).json({ error: 'blogId and userId are required' })
        }

        const blog = await Blog.findByPk(req.body.blogId)
        console.log('Blog found: ', blog.dataValues)

        if (!blog){
            return res.status(400).json({
                error: 'blogId not found'
            })
        }

        const user = await User.findByPk(req.body.userId)
        console.log('User found: ', user.dataValues)

        if (!user){
            return res.status(400).json({
                error: 'userId not found'
            })
        }

        const readingList = await ReadingList.create({
            ...req.body,
            status: 'unread'
        })
        res.status(200).json(readingList)

    } catch (error) {
        console.error('Error: ', error)
        next(error)
    }
})

router.put('/:id', tokenExtractor, async (req, res) => {

    console.log('Reading list body to update: ', req.body)

    const readingList = await ReadingList.findByPk(req.params.id)

    if (!readingList) {
        return res.status(404).json({
            error: 'Reading list entry not found'
        })
    }
    
    console.log('Reading list found to update: ', readingList.dataValues )

    if ( readingList.userId !== req.decodedToken.id ){
        return res.status(403).json({
            error: 'You are not allowed to modify another users reading list'
        })
    }

    readingList.status = req.body.status
    await readingList.save()

    return res.status(200).json(readingList)

})

module.exports = router