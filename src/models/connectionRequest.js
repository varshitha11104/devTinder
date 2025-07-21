const mongoose=require('mongoose');

const connectionRequestScheme=new mongoose.Schema({
    fromUserId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values : ["accepted","rejected","ignored","interested"],
            message:`{value} is incorrected status type`  //error message
        },
    }
},
{
    timestamps:true,
}
);

connectionRequestScheme.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("connection request to yourself is not allowed");
    }
    next();

});
const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestScheme);

module.exports=ConnectionRequestModel;