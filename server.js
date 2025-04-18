import app from "./app.js";
import { config } from "./config/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { generateMessage } from "./utils/messages.js";

const PORT = config.port || 3000;
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust as needed)
    methods: ["GET", "POST"],
  },
});
// Store user data
const users = {};

io.on("connection", (socket) => {
  console.log("A new user connected:", socket.id);

  // Send welcome message to the connected user
  // socket.emit("message", generateMessage("Welcome to the chat!"));

  // // Broadcast to others (excluding the sender)
  // socket.broadcast.emit(
  //   "message",
  //   generateMessage(`User ${socket.id} has joined`)
  // );

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit(
      "message",
      generateMessage(`Welcome to the ${room}, ${username}!`)
    );

    // Broadcast to others (excluding the sender)
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined`));
  });

  // Listen for messages from client and broadcast to all users
  socket.on("newMessage", (message) => {
    console.log(`Received message from ${socket.id}:`, message);
    // CHANGE THIS LINE:
    // FROM: io.to("south").emit("message", generateMessage(message));
    // TO:
    const userRooms = [...socket.rooms];
    // The first room in userRooms is the socket ID, the second one (if exists) is the joined room
    const roomName = userRooms.length > 1 ? userRooms[1] : null;
    if (roomName) {
      io.to(roomName).emit("message", generateMessage(message));
    } else {
      // Fallback if no room is found (shouldn't happen in normal flow)
      socket.emit("message", generateMessage(message));
    }
  });

  // Handle location sharing
  socket.on("shareLocation", (coords) => {
    io.emit("locationMessage", {
      userId: socket.id,
      url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
      created: new Date().getTime(),
    });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    io.emit("message", generateMessage(`User ${socket.id} has left`));
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
