const Joi= require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer:{
type:new mongoose.Schema({
    name: {
    type:String,
    required:true,
    minLength:5,
    maxLength:50,
},
isGold: {
    type:Boolean,
    default:false,
},
phone: {
    type:String,
    required:true,
    minLength:5,
    maxLength:50,
},
 }),
required:true,
},
movie: {
    type:new mongoose.Schema({
        title: {
            type:String,
            required:true,
            minLength:5,
            maxLength:50,
         },
        genreId: {
            type:String,
            // required:true,
        },
        numberInStock: {
            type:Number,
            // required:true,
            min:0,
        },
        dailyRentalRate: {
            type:Number,
            required:true,
            min:0,
        },
    }), 
    required:true,
    },
    dateOut: {
        type:Date,
        required:true,
        default: Date.now
    },
    dateReturned: {
        type:Date,
      
    },
    rentalFee: {
        type:Number,
        min:0,
        
    },
}
));
    
function validateRental(movie){
    const schema =Joi.object({
        customerId:
            Joi.objectId().required(),
           movieId: Joi.objectId().required(),
            
        
    });
    return schema.validate(movie );
    
      }
      exports.Rental = Rental;     
      exports.validate = validateRental;