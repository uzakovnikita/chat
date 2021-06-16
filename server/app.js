const express = require("express");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');
const activateRoutes = require('./routes/activate');

const app = express();
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api', roomsRoutes);
app.use('/api', messageRoutes);
app.use('/api', activateRoutes);
const server = http.createServer(app);

module.exports.server = server;