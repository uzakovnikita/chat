const { Server } = require('socket.io');
const { server } = require('../app');
const User = require('../db/models/User');
const Rooms = require('../db/models/Rooms');

const io = new Server(server, { cors: { origin: '*' } });

io.use((socket, next) => {
    const { userID } = socket.handshake.auth;

    socket.userID = String(userID);
    next();
});

io.on('connection', async (socket) => {
    // используется для того чтобы войти в комнату которую мы переопределили
    socket.on('join', (socket) => {
        socket.join(socket.room);
    });
    socket.on('leave', (socket) => {
        socket.leave(socket.room);
    })
    // для того чтобы подписчики клиентов получили событие что подключен новый пользователь
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        username: socket.username,
    });
    // отправляем данные с сессией чтобы клиент её потом сохранил
    socket.emit('session', {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });
    socket.on('private message', ({ room, from, to, content }) => {
        Rooms.updateOne(
            { _id: room },
            { messages: $push({ from, to, content }) },
        );
        io.to(room).emit('private message', { from, to, content });
    });
    socket.on('disconnect', async () => {
        const mathcingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = mathcingSockets.size === 0;
        if (isDisconnected) {
            socket.broadcast.emit('user disconnected', socket.userID);
            // sessionStore.saveSession(socket.sessionID, {
            //     userID: socket.userID,
            //     username: socket.username,
            //     connected: false,
            // });
        }
    });
});

module.exports = this;
