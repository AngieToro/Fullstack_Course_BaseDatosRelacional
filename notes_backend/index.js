require('dotenv').config()
const express = require('express')
const app = express()
const NoteModel = require('./models/notes')

app.use(express.json())

app.get('/api/notes', async (req, res) => {
    const notes = await NoteModel.findAll()
    console.log('Notes: ', notes)
    res.json(notes)
})

app.post('/api/notes', async (req, res) => {
    console.log('Body: ', req.body)

    try {
        const note = NoteModel.build(req.body)
        await note.save()
        res.json(note)
    } catch (error) {
        console.error('Error: ', error);
        return res.status(400).json( { error } )
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT } `);
})