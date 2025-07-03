const express=require('express');

const app=express();

//responds to only post
app.post("/user",(req,res)=>{
    res.send("user in post");
})

//responds to only get
app.get("/user",(req,res)=>{
    res.send("user in get");
})

app.use("/user",(req,res)=>{  //responds to both get and post
    res.send("inside helo");
})

app.listen(3000,()=>{
    console.log('server is listening at 3000...');
});