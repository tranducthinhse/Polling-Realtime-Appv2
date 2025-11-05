// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import pollRoutes from "./routes/pollRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { initIO } from "./socket.js";

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ CORS cho cả local & Netlify
app.use(cors({
  origin: ["http://localhost:3000", "https://pollingrealtime.netlify.app"],
  credentials: true
}));

app.use(express.json());

// ✅ Kiểm tra server
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

app.use("/api/polls", pollRoutes);
app.use("/api/auth", authRoutes);

// ✅ Kết nối Mongo
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ✅ Thêm cấu hình CORS cho Socket.IO
    initIO(server, {
      cors: {
        origin: ["http://localhost:3000", "https://pollingrealtime.netlify.app"],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();
