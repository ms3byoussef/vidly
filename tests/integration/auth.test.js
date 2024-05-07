const request =require('supertest');
const {User} =require('../../models/user');
const { Genre } = require('../../models/genre');
let server ;

describe('auth middleware',()=>{

    //Define the happy path , and then in each 
  
        beforeEach(() =>{server= require('../../index');})
        afterEach(async() =>{ 
            await  server.close();
            await Genre.deleteMany({});

        });
    
    
     

    let token;
    //describe the happy path

    const exec = ()=>{
    return  request(server)
    .post('/api/genres')
    .set('x-auth-token',token)
    .send({name: "genre1"});}

    beforeEach( ()=>{
        token=new User().generateAuthToken();      


});

    it('should return 401 when no token provided', async ()=>{
        token='';
        const res = await exec();
        expect(res.status).toBe(401);
    });  
      it('should return 400  token  is invalid', async ()=>{
        token='a';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200  token  is valid', async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });
});