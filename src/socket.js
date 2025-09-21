import { io } from "socket.io-client";

export const socket = io("https://voice-calling-server.onrender.com", {
  transports: ["websocket"], 
});
