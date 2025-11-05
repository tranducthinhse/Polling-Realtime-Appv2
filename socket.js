// socket.js
import { Server } from "socket.io";

let io;

export const initIO = (server, options = {}) => {
  io = new Server(server, options); // ✅ CORS được truyền từ server.js

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
