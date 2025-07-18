const express=require('express');
const User=require('../models/user');
const {userAuth}=require('../middleware/auth');
const {validateEditProfileData}=require('../utils/validation');

const profileRouter=express.Router();

profileRouter.get('/profile/view',userAuth,async (req,res)=>{
    try{
        
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
        try{
            if(!validateEditProfileData){
                throw new Error("Invalid user edit data");
            }
            const loggedInUser=req.user;
            Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
            await loggedInUser.save();

            res.send({
                message:`${loggedInUser.firstName}, your profile updated successfully`,
                data:loggedInUser
            });

        }catch(err){
            res.status(400).send("ERROR : "+err.message);
        }
});
module.exports=profileRouter;