const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useCreateIndex : true,
    useUnifiedTopology: true,
    // useFindAndModify : true,
  });
  console.log("mongodb connect");
};
module.exports = connectDB;

// mongodb+srv://<username>:<password>@cluster0.qf920.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
