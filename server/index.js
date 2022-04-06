require("dotenv").config({ path: "./config.env" });
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const express = require("express");
const app = express();
const cookieParser= require("cookie-parser");
// const cookieParser= require("../");
const errorHandler = require("./middlewares/errorHandler");

// Connect Database
connectDB();


app.use(express.json());
app.use(cors({credentials:true,origin:"http://localhost:3001"}))
app.use(cookieParser());


app.use("/api/auth", require("./Routes/auth"));
app.use("/api/private", require("./Routes/private"));


// error handler should be in last
app.use(errorHandler);


if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"/client/build")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"client","build","index.html"))
  })
}else{
  app.get("/",(req,res)=>{
    res.send("APP RUNNING OK sd")
  })
}




const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server starter at ${PORT}`);
});

process.on("unhandleRejection", (err, promise) => {
  console.log(err);
  server.close(() => process.exit(1));
});
