const jwt=require('jsonwebtoken');
const User=require('../models/user');

const userAuth=async (req,res,next)=>{
    try{
    //read the token from req
    const {token}=req.cookies;
    if(!token){
        throw new Error("Token not valid");
    }
    //verify the token
    const decodedObj=await jwt.verify(token,'devTinder');

    const {_id}=decodedObj;

    //find the user
    const user =await User.findById({_id:_id});
    if(!user){
        throw new Error("User does not exist");
    }
    req.user = user;
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
    
    next();
}

module.exports={
    userAuth
}