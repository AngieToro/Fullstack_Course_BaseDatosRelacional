const router = require('express').Router()
const { Team } = require('../models');

//Busca todos los elementos
router.get('/', async (req, res) => {
    
    const teams = await Team.findAll()
    console.log('Teams: ', teams)
    
    res.status(200).json(teams)
})

//Se agrega un elemento
router.post('/', async (req, res) => {
    console.log('Teams body to create: ', req.body)

    try {
              
        const team = Team.build( req.body )
        await team.save()
        console.log('Team to add: ', team)
        
        res.status(200).json(team)

    } catch (error) {
        console.error('Error: ', error)
        res.status(400).json( { error } )
    }
})

module.exports = router