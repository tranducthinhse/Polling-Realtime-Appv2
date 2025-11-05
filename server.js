import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { initIO } from "./socket.js";
import pollRoutes from "./routes/pollRoutes.js";

dotenv.config();

const app = express();

// ✅ Cấu hình CORS cho Netlify
app.use(
  cors({
    origin: ["https://pollingrealtime.netlify.app"], // domain frontend của bạn
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware cơ bản
app.use(express.json());
app.use("/api/polls", pollRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Server is running and CORS is enabled!");
});

// ✅ Khởi tạo server HTTP + Socket.IO
const server = http.createServer(app);

// ✅ Socket.IO với CORS
initIO(server, {
  cors: {
    origin: ["https://pollingrealtime.netlify.app"],
    methods: ["GET", "POST"],
  },
});

// ✅ PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
