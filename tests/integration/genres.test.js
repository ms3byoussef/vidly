const request =require('supertest');
const {User} =require('../../models/user');
const { Genre } = require('../../models/genre');
const { default: mongoose } = require('mongoose');
let server ;

describe('/api/genres', ()=>{
    beforeEach(() =>{
        server= require('../../index');

    })
    afterEach(async() =>{
        await Genre.deleteMany({});

        await  server.close();      

    });

    describe('Get/',()=>{
    it('should return all genres ', async ()=>{

    await Genre.insertMany([
            {name:'genre1'},
            {name:'genre2'},
     ]);
    const res = await request(server).get('/api/genres');
    expect(res.body.length).toBe(2);   
     expect(res.status).toBe(200);
    expect(res.body.some(g=>g.name==='genre1')).toBeTruthy();
    expect(res.body.some(g=>g.name==='genre2')).toBeTruthy();

});
});
describe('Get/:id',()=>{
    it('should return a genre valid id is pass ', async ()=>{
const genre=new Genre({name:'genre1'});
            await genre.save();

    const res = await request(server).get('/api/genres/'+genre._id);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name',genre.name);
}); 
it('should return 404 if  invalid id is pass ', async ()=>{
  
        const res = await request(server).get('/api/genres/1');
        expect(res.status).toBe(404);
    }); 
    it('should return 404 if  no genre with the given id exists ', async ()=>{
      const id =new mongoose.Types.ObjectId();
        const res = await request(server).get('/api/genres/'+id);
        expect(res.status).toBe(404);
    }); 
});
describe('Post/',()=>{

    //Define the happy path , and then in each 

    let token;
let name;
    //describe the happy path

    const exec = ()=>{
    return  request(server)
    .post('/api/genres')
    .set('x-auth-token',token)
    .send({name: name});
}

    beforeEach( ()=>{
        token=new User().generateAuthToken();  
        name="genre1";
});

    it('should return 401 if client not logged in', async ()=>{
        token='';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if genre is less than 5 characters', async ()=>{
        name='1234';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async ()=>{
         name = new Array(52).join('a');
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 400 if genre is invalid', async ()=>{
        const res = await exec();
        const genre=Genre.find({name: "genre1"});
        expect(genre).not.toBeNull();
    }); 
    it('should return genre if genre is invalid', async ()=>{
        const res = await exec();
        const genre=Genre.find({name: "genre1"});
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("name","genre1");
    });
}); 
});
