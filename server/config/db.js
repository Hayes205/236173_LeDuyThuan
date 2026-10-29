const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Chưa cấu hình biến MONGODB_URI");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Kết nối MongoDB Atlas thành công");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error.message);
    throw error;
  }
}

module.exports = connectDB;