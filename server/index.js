const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

import sessionStore from "./sessionStore";

const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 1000;

const rooms = new Map();
app.use(cors());
app.get("/rooms", (req, res) => {
  rooms.set();
  res.json(rooms);
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  const sessionID = randomId();
  const userID = randomId();
  sessionStore.saveSession(sessionID, {userID, username});
  socket.sessionID = sessionID;
  socket.userID = userID;
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
	// используется для того чтобы войти в комнату которую мы переопределили
	socket.join(socket.userID);
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
	// для того чтобы клиент получил список пользователей
  socket.emit("users", users);
	// для того чтобы подписчики клиентов получили событие что подключен новый пользователь
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });
  // отправляем данные с сессией чтобы клиент её потом сохранил
	socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  socket.on("private message", ({ content, to }) => {
    socket.to(to).to(socket.userID).emit("private message", {
      content,
      from: socket.id,
    });
  });

});

server.listen(PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`server has been started on PORT ${PORT}`);
});
