const express=require('express');

const app=express();
const connectDB=require('./config/database');
const User=require('./models/user');
app.use(express.json());

app.post('/signup',async (req,res)=>{
     //creating a new instance of the user model
     const userData=req.body
    const user=new User(userData
    );
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

app.delete('/deleteUser',async (req,res)=>{
    const userId=req.body.userId;
    try{
        await User.deleteOne({_id:userId});
        res.send("successfully deleted");
    }catch(err){
        res.status(400).send("deleted failed",err.message);
    }
});

app.patch('/update',async (req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        const user=await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true,
        });
        console.log(user);
        res.send("user successfully updated");
    }catch(err){
        res.status(400).send("update failed");
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

