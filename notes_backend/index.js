require('dotenv').config()
const express = require('express')
const app = express()
const NoteModel = require('./models/notes')

app.use(express.json())

//Busca todos los elementos
app.get('/api/notes', async (req, res) => {
    const notes = await NoteModel.findAll()
    //console.log('Notes: ', notes.toJSON())
    //console.log( notes.map ( note => note.toJSON()))
    console.log('Notes: ', JSON.stringify(notes, null, 2))
    
    return res.json(notes)
})

//Busca un solo elemento
app.get('/api/notes/:id', async (req, res) => {

    console.log('Note id: ', req.params.id);
    
    const note = await NoteModel.findByPk(req.params.id)

    if (note){
        console.log('Note: ', note)
        return res.json(note)
    } else {
        return res.status(404).end()
    }
})

//Se agrega un elemento
app.post('/api/notes', async (req, res) => {
    console.log('Body: ', req.body)

    try {
        const note = NoteModel.build(req.body)
        await note.save()
        return res.json(note)
    } catch (error) {
        console.error('Error: ', error);
        return res.status(400).json( { error } )
    }
})

//Se modifica un elemento
app.put('/api/notes/:id', async (req, res) => {

    console.log('Note id: ', req.params.id);
    
    const note = await NoteModel.findByPk(req.params.id)
    console.log('Note: ', note)

    if (note){
        note.important = req.body.important
        await note.save()
        return res.json(note)
    } else {
        return res.status(404).end()
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT } `);
})