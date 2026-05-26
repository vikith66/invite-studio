const mongoose = require("mongoose");

const connectDB = async () => {
  // We don't catch inside db.js, let server.js handle connection errors during startup
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

module.exports = connectDB;