const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is not valid",value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is not strong",value);
            }
        },
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"This is the default description of the user"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true,
});



module.exports=mongoose.model("User",userSchema);