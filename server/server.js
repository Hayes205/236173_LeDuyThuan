const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8081",
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Origin không được phép bởi CORS: " + origin));
        }
    }
}));

app.use(express.json({ limit: "1mb" }));

// Kiểm tra trạng thái backend và kết nối database
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");

  const dbConnected = mongoose.connection.readyState === 1;

  return res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "UP" : "DEGRADED",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// API quản lý món ăn
app.use("/api/foods", foodRoutes);

// Endpoint không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy endpoint",
  });
});

// Xử lý JSON không hợp lệ và lỗi middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "JSON đầu vào không hợp lệ",
    });
  }

  console.error("Server error:", err.message);

  return res.status(500).json({
    success: false,
    message: "Lỗi máy chủ",
  });
});

async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend đang chạy tại cổng ${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động backend:", error.message);
    process.exit(1);
  }
}

startServer();