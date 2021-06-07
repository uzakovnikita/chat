const { Server } = require('socket.io');
const { server } = require('../app');
const User = require('../db/models/User');
const Rooms = require('../db/models/Rooms');
const Message = require('../db/models/Message');

const io = new Server(server, { cors: { origin: '*' } });

io.use((socket, next) => {
    const { userID } = socket.handshake.auth;
    socket.userID = String(userID);
    next();
});

io.on('connection', async (socket) => {
    // используется для того чтобы войти в комнату которую мы переопределили
    socket.on('join', async (data) => {
        socket.join(data.room);
        const dataOfRoom = await Rooms.findById(data.room);
        const idsOfMessages = dataOfRoom.messages;
        const messages = await Message.find({'_id': {
            $in: [
                ...idsOfMessages
            ]
        }});
        socket.emit('initial message', {messages});
    });
    socket.on('leave', (data) => {
        socket.leave(data.room);
    });
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
    socket.on('private message', async ({ room, from, to, content }) => {
        const newMsg = Message({ messageBody: content, from, to , room});
        await newMsg.save();
        await Rooms.updateOne(
            { _id: room },
            {
                $push: {
                    "messages": newMsg._id
                }
            },
        );
        io.to(room).emit('private message', newMsg);
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
