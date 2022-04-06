exports.getPrivateData = async (req,res,next)=>{
    res.status(200)
    // .cookie("testTOken","Ratul1234",{
    //     sameSite:"strict",
    //     path:"/",
    //     maxAge:(3*1000),
    //     httpOnly:true  
    // })
    .json({
        success:true,
        authenticated:true,
        data:"You got access to the private data in this route"
    })

}