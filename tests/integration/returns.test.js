const{Rental}=require('../../models/rental');
const{Movie}=require('../../models/movie');
const{User}=require('../../models/user');
const mongoose=require('mongoose');
const request =require('supertest');
const moment =require('moment');


describe('/api/returns', ()=>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    const exec = ()=>{
        return  request(server)
        .post('/api/returns')
        .set('x-auth-token',token)
        .send({
            customerId,
            movieId
        });
    }
    

    beforeEach(async () =>{
        server= require('../../index');

        customerId=new mongoose.Types.ObjectId();
        movieId=new mongoose.Types.ObjectId();
        token=new User().generateAuthToken();  

        movie = new Movie({
            _id:movieId,
            title:'12345',
            dailyRentalRate: 2,
            genre:{
                name:'12345'
            },
            numberInStock:10,
        });

        await movie.save();

     rental =  new Rental({
    customer:{
        _id:customerId,
        name:'12345',
        phone:'12345'
    },
    movie:{
        _id:movieId,
        title:'12345',
        dailyRentalRate:2
    }

});
await rental.save();



    });

    afterEach( async () =>{ 
        await  server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});

    });

    it('rental should  work', async()=>{

        const result=await Rental.findById(rental._id);

        expect(result).not.toBeNull();

    }); 
    it(' should return 401 if client not logged in ', async()=>{
        token='';

     const res=await exec();

     expect(res.status).toBe(401);

    });
       it(' should return 400 if customerId is not provided ', async()=>{
        customerId='';

        const res=await exec();
   
        expect(res.status).toBe(400);
   
       }); 
       
       it(' should return 400 if movieId is not provided ', async()=>{
        movieId='';
        const res=await exec();
   
        expect(res.status).toBe(400);
   
       });
        it(' should return 404 if no rental found for this customer/movie', async()=>{
            await Rental.deleteMany({});      

            const res=await exec();      

   
        expect(res.status).toBe(404);
   
       }); 
       it(' should return 400 if rental is already processed', async()=>{
            rental.dataReturned= new Date();
                await rental.save();
                const res= await exec();

            expect(res.status).toBe(400);

   }); 

   it(' should return 200 if get valid request', async()=>{

        const res = await exec();

        expect(res.status).toBe(200);

}); 
it(' should set returnDate if input is valid ', async()=>{

  const res =   await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

expect(rentalInDb.dateReturned).toBeDefined();

}); 

it(' should set rentalFee if input is valid ', async()=>{

rental.dateOut = moment().add(-7, 'days').toDate();
await rental.save();

   const res = await exec();
   const rentalInDb = await Rental.findById(rental._id);

expect(rentalInDb.rentalFee).toBeDefined();

}); 

it(' should increase movie stock if input is valid ', async()=>{
          const res= await exec();
       const movieInDb = await Movie.findById(movieId);

       expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
       
    
    }); 

    it(' should return rental if input is valid ', async()=>{

        
           const res = await exec();
           const rentalInDb = await Rental.findById(rental._id);
        
           expect(res.body).toHaveProperty('dateOut');
           expect(res.body).toHaveProperty('dateReturned');
           expect(res.body).toHaveProperty('rentalFee');
           expect(res.body).toHaveProperty('customer');
           expect(res.body).toHaveProperty('movie');
        
        }); 
        
    
});