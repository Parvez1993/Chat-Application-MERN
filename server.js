// File: server.js
import app from "./app.js";
import { config } from "./config/index.js";
import { createServer } from "http";
import { Server } from "socket.io"; // Change this line

const PORT = config.port || 3000;
const serverNew = createServer(app);

// Initialize Socket.IO with correct import
const io = new Server(serverNew); // Change this line

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    console.log(msg);
  });
});
console.log("xxxxxxxxx");

const server = serverNew.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
