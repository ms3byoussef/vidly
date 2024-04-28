const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre,validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');


router.get('/', async(req, res) => {
    const genres= await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{
        const newGenre = new Genre( { name: req.body.name, });
      await newGenre.save();

      res.send(newGenre);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{
   const genre=    await Genre.findByIdAndUpdate(req.params.id, {name:req.body.name ,new: true });
   res.send(genre);

    }
});

router.delete('/:id',  [auth,admin],async (req, res) => {      
   const genre= await Genre.findByIdAndDelete(req.params.id)
   res.send(genre);

  });

  router.get('/:id',validateObjectId ,async (req, res) => {
    const genre= await Genre.findById(req.params.id)    ;
if(!genre) return res.status(404).send('Genre not found');
    res.send(genre);
  });



  module.exports = router;