const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });
const cors = require('cors');

const PORT = process.env.PORT || 1000;

const rooms = new Map();
app.use(cors());
app.get('/rooms', (req, res) => {
    rooms.set();
    res.json(rooms);
});

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        console.log(data);
        io.emit('message', data);
    });
});

server.listen(PORT, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`server has been started on PORT ${PORT}`);
});

