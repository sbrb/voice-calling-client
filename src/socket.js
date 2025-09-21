import { io } from "socket.io-client";

export const socket = io("https://your-backend.onrender.com", {
  transports: ["websocket"], 
});
