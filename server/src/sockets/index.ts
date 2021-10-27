import { Server } from "socket.io";
import { server } from "../app";

import { roomService } from "../domain/useCases";

const io = new Server(server, { cors: { origin: "*" } });

io.use((socket, next) => {
  const { userID } = socket.handshake.auth;
  socket.userID = String(userID);
  next();
});

io.on("connection", async (socket) => {
  socket.on("join", async (data) => {
    socket.join(data.room);
  });
  socket.on("leave", (data) => {
    socket.leave(data.room);
  });
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  socket.on("private message", async ({ roomId, from, to, body, date }) => {
    try {
      const message = await roomService.sendMessage({ roomId, from, to, body, date });
      io.to(roomId).emit("private message", message);
    } catch (err) {
      socket.emit("private message failed", err);
    }
  });
  socket.on("disconnect", async () => {
    const mathcingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = mathcingSockets.size === 0;
    if (isDisconnected) {
      socket.broadcast.emit("user disconnected", socket.userID);
    }
  });
});

module.exports = this;
