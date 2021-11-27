import { Server, Socket } from "socket.io";
import server from "../app";

import { roomService } from "../domain/useCases";

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", async (socket: Socket) => {
  socket.on("join", async (data: { room: string }) => {
    socket.join(data.room);
  });
  socket.on("leave", (data) => {
    socket.leave(data.room);
  });
  socket.on(
    "private message",
    async ({
      roomId,
      from,
      to,
      body,
      date,
    }: {
      roomId: string;
      from: string;
      to: string;
      body: string;
      date: string;
    }) => {
      try {
        const message = await roomService.sendMessage({ roomId, from, to, body, date });
        io.to(roomId).emit("private message", message);
      } catch (err) {
        socket.emit("private message failed", err);
      }
    }
  );
});
