const validator=require('validator');

const validateSignUp= ( req ) =>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId))
    {
        throw new Error("email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong");
    }
};

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","skills","emailId","about","photoUrl","gender"];
    const isEditAllowed=Object.keys(req.body).every((field)=>{
        allowedEditFields.includes(field)
    });

}
module.exports={validateSignUp,validateEditProfileData};