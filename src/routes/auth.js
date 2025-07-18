const express=require('express');
const{validateSignUp}=require("../utils/validation");
const User=require('../models/user');
const bcrypt=require('bcrypt');

const authRouter=express.Router();

authRouter.post('/signup',async (req,res)=>{
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

authRouter.post('/login',async (req,res)=>{

    try{
        const {emailId,password} =req.body;

        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            const token = await user.getJWT();
            //send cookie to the user
            res.cookie("token",token,{
                expires:new Date(Date.now()+8+360000)
            });
            res.send("User Login successfull");
        }
        else{
           throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post('/logout',async (req,res)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
    });
    res.send("user logged out successfully");
});

module.exports=authRouter;
