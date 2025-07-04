const express=require('express');

const app=express();
const {authAdmin,authUser}=require('./middleware/auth');

app.use('/admin',authAdmin);


app.get('/user/login',(req,res)=>{
    res.send('user logged in ');
}
);

app.get('/user',authUser
);

app.get('/user/getdata',(req,res)=>{
    res.send('user data fetched for user');
}
);
app.get('/admin/getdata',(req,res)=>{
    res.send('user data fetched');
}
);

app.get('/admin/deleteUser',(req,res)=>{
    res.send('User is deleted');
}
);
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