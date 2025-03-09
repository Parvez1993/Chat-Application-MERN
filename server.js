import app from "./app.js";
import { config } from "./config/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = config.port || 3000;
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust as needed)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A new user connected:", socket.id);

  // Send welcome message to the connected user
  socket.emit("message", "Welcome to the chat!");

  // Broadcast to others (excluding the sender)
  socket.broadcast.emit("message", `User ${socket.id} has joined`);

  // Listen for messages from client and broadcast to all users
  socket.on("newMessage", (message) => {
    console.log(`Received message from ${socket.id}:`, message);
    io.emit("message", message); // Broadcast to everyone
  });

  // Handle location sharing
  socket.on("shareLocation", (coords) => {
    io.emit("locationMessage", {
      url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
      userId: socket.id
    });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    io.emit("message", `User ${socket.id} has left`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  io.close(() => {
    console.log("Socket.IO server closed");
  });
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
