const express=require('express');
const {userAuth}=require('../middleware/auth');
const ConnectionRequest=require('../models/connectionRequest');
const User=require('../models/user');

const requestRouter=express.Router();


requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
   try{

        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:'invalid status type' + status});
        }

        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(400).send("User does not exist");
        }

        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {  fromUserId,toUserId   },
                {  fromUserId:toUserId,toUserId:fromUserId, }
            ],
        })
        if(existingConnectionRequest){
            return res
                .status(400)
                .send({
                    message:"connection request already existed"
                });
        
        }

        const data=await connectionRequest.save();

        res.json({
            message:`${req.user.firstName}  connection request send successfully to ${toUser.firstName}`,
            data
        });

   }catch(err){
    res.status(400).send("ERROR : " + err.message);
   }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
     try{
        const loggedInUser=req.user;
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json( { message:"status not valid" });
        }
        const connectionRequest=await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : 'interested',
        });

        if(!connectionRequest){
            return res.status(404)
            .send("connection not found");
        }

        connectionRequest.status=status;

        const data=await connectionRequest.save();
        res.send("Connection requested"+status+data);

    }catch(err){
        res.status(400).send("ERROR : " +err.message);
    }
});

module.exports=requestRouter;