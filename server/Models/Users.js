const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide a Username"]
    },
    email:{
        type:String,
        required:[true,"Please provide an Email"],
        unique:true,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please fill a valid email address'],
    },
    password:{
        type:String,
        required:[true,"Please add a password"],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordDate:Date,
});



UserSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password,this.password);
}


UserSchema.methods.getSignedToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}

UserSchema.methods.getresetPasswordToken = function(){
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");

    this.resetPasswordDate = Date.now() + 10 * (60*1000);

    return resetPasswordToken;
}


UserSchema.pre("save",async function(next){
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
});





const User = mongoose.model("User",UserSchema); 

module.exports = User;