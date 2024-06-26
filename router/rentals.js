const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental,validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');

Fawn.init('mongodb://localhost/vidly');
router.get('/', async(req, res) => {
    const rentals= await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
      return  res.status(400).send(error.details[0].message);

      const customer=Customer.findById(req.body.customerId)
      if(!customer)
      return  res.status(400).send('customer not found');

      const movie=Movie.findById(req.body.movieId)
      if(!movie)
      return  res.status(400).send('movie not found');
    
      if(movie.numberInStock===0)
      return  res.status(400).send('movie not in stock');
    
        const rental= new Rental(  {
            customer: {
            _id:customer._id ,
            name:customer.name,
            phone:customer.phone
        
        }
     ,movie: {
            _id:movie._id ,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate,
        }
    });
 try {
    new Fawn.Task()
    .save('rentals',rental)
    .update('movies',{_id:movie._id},{
     $inc:{numberInStock:-1}
    })
    .run();
       res.send(rental);
     } catch (error) {
        res.status(500).send('something went wrong');
    
     }}
);


  module.exports = router;