const { Server } = require('socket.io');
const { uuid } = require('uuidv4');
const {server} = require('../app');
const {messageStore} = require('../utils/messageStore');
const {sessionStore} = require('../utils/sessionStore');

const io = new Server(server, { cors: { origin: '*' } });

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
        return next(new Error('invalid username'));
    }
    // create new session
    const sessionID = uuid();
    const userID = uuid();
    sessionStore.saveSession(sessionID, { userID, username });
    socket.sessionID = sessionID;
    socket.userID = userID;
    socket.username = username;
    next();
});

io.on('connection', (socket) => {
    // используется для того чтобы войти в комнату которую мы переопределили
    socket.join(socket.userID);
    const users = [];
    const messagesPerUser = new Map();
    messageStore.findMessagesForUser(socket.userID).forEach((message) => {
        const { from, to } = message;
        const otherUser = socket.userID === from ? to : from;
        if (messagesPerUser.has(otherUser)) {
            messagesPerUser.get(otherUser).push(message);
        } else {
            messagesPerUser.set(otherUser, [message]);
        }
    });
    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            userID: session.userID,
            username: session.username,
            connected: session.connected,
            messages: messagesPerUser.get(session.userID) || [],
        });
    });
    // для того чтобы клиент получил список пользователей
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
            sessionStore.saveSession(socket.sessionID, {
                userID: socket.userID,
                username: socket.username,
                connected: false,
            });
        }
    });
});
