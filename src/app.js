const express=require('express');
const connectDB=require('./config/database');
const User=require('./models/user');
const{validateSignUp}=require("./utils/validation");
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');  

const app=express();
app.use(express.json());
app.use(cookieParser());

app.post('/login',async (req,res)=>{

    try{
        const {emailId,password} =req.body;

        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){

            //create a jwt token 
            const token = jwt.sign({_id:user._id},"devTinder");
            //send cookie to the user
            res.cookie("token",token);
            res.send("User Login successfull");
        }
        else{
           throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get('/profile',async (req,res)=>{
    try{
        const cookies=req.cookies;
    
        const {token}=cookies;
        if(!token){
            throw new Error("Invalid Token");
        }

        //validate my token
        const decodedMessage=jwt.verify(token,'devTinder');
        const { _id }=decodedMessage;
        
        const user = await User.findById({_id});
        if(!user){
          throw new Error("User does not exist");
        }
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post('/signup',async (req,res)=>{
     //creating a new instance of the user model
     try{
        //validation of data
        validateSignUp(req);

        //encrypting the password
        const {firstName,lastName,emailId,password} =req.body;
        const passwordHash= await bcrypt.hash(password,10);


        //creating a instance of user model
        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });
        await user.save();
        res.send("user created successfully");
     }catch(err){
        res.status(400).send("ERROR:" , err.message);
     }
    
   
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

