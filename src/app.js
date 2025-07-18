const express=require('express');
const connectDB=require('./config/database');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');  


const app=express();
app.use(express.json());
app.use(cookieParser());

//importing routes
const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/request');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDB().then(()=>{
    console.log("database connection is established");
    app.listen(3000,()=>{
    console.log('server is listening at 3000...');
});
}).catch((err)=>{
    console.error("Database cannot be connected",err.message);
}); 

