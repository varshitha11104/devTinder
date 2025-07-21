const express =require('express');
const userRouter=express.Router();
const {userAuth}=require('../middleware/auth');
const ConnectionRequest=require('../models/connectionRequest');
const User = require("../models/user");

const USER_SAFE_DATA="firstName lastName photoUrl gender age about";
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
        try{
            const loggedInUser=req.user;
            const requests=await ConnectionRequest.find({
                toUserId:loggedInUser._id,
                status:"interested"
            }).populate("fromUserId","firstName lastName photoUrl gender age about");
            //}).populate("fromUserId",["firstName","lastName"]);
            res.json({requests});
        }catch(err){
            res.status(400).send("ERROR : " + err.message);
        }
});
userRouter.get("/user/connections",userAuth,async (req,res)=>{
        try{
            const loggedInUser=req.user;
            const connections= await ConnectionRequest.find({
                $or:[
                    {fromUserId:loggedInUser._id,status:"accepted"},
                    {toUserId:loggedInUser._id,status:"accepted"},
                ]
            }).populate("fromUserId","firstName lastName photoUrl gender age about")
            .populate("toUserId","firstName lastName photoUrl gender age about");

            const data=connections.map((row)=>{
                 if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                    return row.toUserId
                 }
                return row.fromUserId
            });
               
            res.json({
                'message':data
            });
        }catch(err){
            res.status(400).send("ERROR : ",err.message);
        }
});

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query,limit) || 10;
        limit =limit>50 ? 50 : limit;
        const skip=(page-1)*limit;

        const connectionRequest=await ConnectionRequest.find({
            $or :[
                {fromUserId:loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId   toUserId");  

        const hideUsersFromFeed=new Set();
        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users=await User.find({
            $and :[
                {_id:{ $nin : Array.from(hideUsersFromFeed) }},
                {_id:{ $ne : loggedInUser._id}},
            ]
            
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({users});

    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports=userRouter;