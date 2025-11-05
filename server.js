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

// Middleware
app.use(cors({
  origin: ["http://localhost:3000"], // React frontend
  credentials: true
}));
app.use(express.json());

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Routes
app.use("/api/polls", pollRoutes);
app.use("/api/auth", authRoutes);

// ✅ Error handling middleware (placed AFTER routes)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// ✅ Start server with MongoDB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Initialize Socket.IO
    initIO(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 MongoDB connected successfully`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
};

// ✅ Handle fatal errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});

// Run
startServer();
