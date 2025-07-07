const express=require('express');

const app=express();
const connectDB=require('./config/database');
const User=require('./models/user');
app.use(express.json());

app.post('/signup',async (req,res)=>{
     //creating a new instance of the user model
    const user=new User({
        firstName:'ms',
        lastName:'Dhoni',
        emailId:'dhoni@gmail.com',
        password:'dhoni@123'
    });
    await user.save();
    res.send("user created successfully");
   
});

app.get('/user',async (req,res)=>
{
   // const userEmail=req.body.emailId;
    try{ 
        const users=await User.findOne({});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong",err.message);
    }
});

connectDB().then(()=>{
    console.log("database connection is established");
    app.listen(3000,()=>{
    console.log('server is listening at 3000...');
});
}).catch((err)=>{
    console.error("Database cannot be connected",err.message);
});

