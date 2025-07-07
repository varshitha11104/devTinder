const mongoose=require("mongoose");


const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://bhumireddyvarshitha944:wE1sNbkEHq215UwR@cluster0.gpryw9z.mongodb.net/devTinder");
};

module.exports=connectDB;
