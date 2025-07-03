const express=require('express');

const app=express();

//writing multiple request handlers
//app.use("/route",rh1,rh2,rh3)
app.use("/user",(req,res,next)=>{  //responds to both get and post
    console.log("request handler1");
    //res.send("Response 1");
    next();
},
(req,res)=>{
    console.log("request handler 2");  //this will also execute while next() called
    res.send("response 2"); //shows error because tcp connection got closed after sending first reponse
}
);

app.listen(3000,()=>{
    console.log('server is listening at 3000...');
});