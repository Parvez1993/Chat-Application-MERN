import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

export function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const username = searchParams.get("username");
  const roomName = searchParams.get("room");

  // Redirect if missing params
  useEffect(() => {
    if (!username || !roomName) {
      navigate("/");
    }
  }, [username, roomName, navigate]);

  // State for active conversation and user
  const [conversations, setConversations] = useState([
    { id: 1, name: roomName || "General", active: true, unread: 0 },
  ]);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // Find the active conversation
  const activeConversation =
    conversations.find((conv) => conv.active) || conversations[0];

  // Connect to socket.io server
  useEffect(() => {
    if (!username || !roomName) return;

    // Initialize socket connection
    socketRef.current = io();

    // Join room
    socketRef.current.emit("join", { username, room: roomName });

    // Handle incoming text messages
    socketRef.current.on("message", (message) => {
      console.log("New message:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "text",
          text: message.text,
          created: message.created,
        },
      ]);
    });

    // Handle location messages
    socketRef.current.on("locationMessage", (locationData) => {
      console.log("Location shared:", locationData);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "location",
          url: locationData.url,
          created: locationData.created,
        },
      ]);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username, roomName]);

  // Handle changing active conversation
  const handleConversationChange = (id) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => ({
        ...conv,
        active: conv.id === id,
        unread: conv.id === id ? 0 : conv.unread,
      }))
    );
    setMessages([]);
  };

  // Send a new message
  const handleSendMessage = (text) => {
    if (text.trim() !== "") {
      socketRef.current.emit("newMessage", text);
    }
  };

  // Send location
  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        socketRef.current.emit("shareLocation", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        alert("Unable to fetch location: " + error.message);
      }
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ChatSidebar
        username={username || "John Doe"}
        conversations={conversations}
        onConversationChange={handleConversationChange}
      />
      {/* Chat window */}
      <ChatWindow
        activeConversation={activeConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        onSendLocation={handleSendLocation}
      />
    </div>
  );
}
