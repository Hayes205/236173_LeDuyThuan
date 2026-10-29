const mongoose = require("mongoose");

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("Thiếu biến môi trường MONGODB_URI");
  }

  await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB Atlas kết nối thành công");
  console.log("Database đang sử dụng:", mongoose.connection.name);
}

module.exports = connectDB;