const { Server } = require('socket.io');
const {server} = require('../app');
const User = require('../db/models/User');

const io = new Server(server, { cors: { origin: '*' } });

io.use((socket, next) => {
    const {userID} = socket.handshake.auth;

    socket.userID = userID;
    next();
});

io.on('connection', async (socket) => {
    // используется для того чтобы войти в комнату которую мы переопределили
    socket.join(socket.userID);
    const users = await User.find().map(({_id, name}) => ({id: _id, name}));
    socket.emit('users', users);
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
    socket.on('private message', ({ content, to }) => {
        const message = {
            content,
            from: socket.userID,
            to,
        };
        socket.to(to).to(socket.userID).emit('private message', {
            content,
            from: socket.id,
        });
        messageStore.saveMessage(message);
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