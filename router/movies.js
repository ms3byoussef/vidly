const{Genre}=require('../models/genre')
const{Movie,Validate}=require('../models/movie')
const mongoose=require('mongoose')
const express = require('express');
const router = express.Router();




router.get('/', async(req, res) => {
    const movies= await Movie.find().sort('name');
    res.send(movies);
});

router.post('/', async (req, res) => {
    const { error } = Validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);

        const genre = new Genre.findById( req.body.genreId);
if(!genre)return res.status(400).send('invalid genre');

        const movie = new Movie( {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
           
        });
      await movie.save();

      res.send(movie);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = Validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{
   const movie=    await Movie.findByIdAndUpdate(req.params.id, {name:req.body.name ,new: true });
   res.send(movie);

    }
});

router.delete('/:id',  async (req, res) => {      
   const genre= await Genre.findByIdAndDelete(req.params.id)
   res.send(genre);

  });

  router.get('/:id', async (req, res) => {
    const genre= await Genre.findById(req.params.id)    ;
if(!genre) return res.status(404).send('Genre not found');
    res.send(genre);
  });



  module.exports = router;