const express = require('express');
const {Customer,validate} = require('../models/customer');

const router = express.Router();




router.get('/', async(req, res) => {
    const customers= await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{
        const newCustomer = new Customer( {
             name: req.body.name,
             phone: req.body.phone,
             isGold: req.body.isGold,
         });
      await newCustomer.save();

      res.send(newCustomer);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{
   const customer=    await Customer.findByIdAndUpdate(req.params.id, {name:req.body.name ,new: true });
   res.send(customer);

    }
});

router.delete('/:id',  async (req, res) => {      
   const customer= await Customer.findByIdAndDelete(req.params.id)
   res.send(customer);

  });

  router.get('/:id', async (req, res) => {
    const customer= await Customer.findById(req.params.id)    ;
if(!customer) return res.status(404).send('Customer not found');
    res.send(customer);
  });



  module.exports = router;