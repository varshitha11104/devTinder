const authAdmin=("/admin",(req,res,next)=>{
    const token='xyz';
    const adminAuth=token==='xyz';
    if(!adminAuth){
        res.status(401).send("Admin not authorized");
    }
    else{
        next();
    }
});

const authUser=("/user",(req,res,next)=>{
    const token='xyz';
    const adminAuth=token==='xyz';
    if(!adminUser){
        res.status(401).send("user not authorized");
    }
    else{
        next();
    }
});

module.exports={authAdmin,authUser};