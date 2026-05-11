import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],   // force websocket
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id);
});



export default socket;