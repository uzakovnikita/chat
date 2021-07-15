const { Server } = require('socket.io');
const { server } = require('../app');

const Rooms = require('../db/models/Rooms');
const Message = require('../db/models/Message');

const io = new Server(server, { cors: { origin: '*' } });

io.use((socket, next) => {
    const { userID } = socket.handshake.auth;
    socket.userID = String(userID);
    next();
});

io.on('connection', async (socket) => {
    socket.on('join', async (data) => {
        socket.join(data.room);
    });
    socket.on('leave', (data) => {
        socket.leave(data.room);
    });
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        username: socket.username,
    });
    socket.emit('session', {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });
    socket.on('private message', async ({ room, from, to, content }) => {
        const newMsg = Message({ messageBody: content, from, to, room });
        await newMsg.save();
        await Rooms.updateOne(
            { _id: room },
            {
                $push: {
                    messages: newMsg._id,
                },
            },
        );
        const result = {
            _id: newMsg._id,
            messageBody: newMsg.messageBody,
            from: newMsg.from,
            to: newMsg.to,
            roomId: newMsg.room,
        };
        io.to(room).emit('private message', result);
    });
    socket.on('disconnect', async () => {
        const mathcingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = mathcingSockets.size === 0;
        if (isDisconnected) {
            socket.broadcast.emit('user disconnected', socket.userID);
        }
    });
});

module.exports = this;
