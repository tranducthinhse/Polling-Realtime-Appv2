import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Cho phép CORS từ Netlify (và localhost để test)
app.use(cors({
  origin: [
    "https://pollingrealtime.netlify.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Cấu hình Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "https://pollingrealtime.netlify.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
  },
});

// ✅ Xử lý sự kiện Socket.io
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ Ví dụ API test
app.get("/", (req, res) => {
  res.send("Server is running fine ✅");
});

app.get("/api/polls", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// ✅ Cổng server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
