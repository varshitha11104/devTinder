const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

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

userSchema.methods.getJWT=async function(){  //must use function keyword should not use arrow functions
    const user=this;   //this represents to current instance document 
    const token =await jwt.sign({_id:user._id},"devTinder",{expiresIn:"1d"});

    return token;
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,user.password);

    return isPasswordValid; 
}

module.exports=mongoose.model("User",userSchema);