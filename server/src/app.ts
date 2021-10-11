const express = require("express");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');
const activateRoutes = require('./routes/activate');
const errorMiddleware = require('./middlewares/error-middleware');
const authMiddleware = require('./middlewares/auth-middleware');

const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, roomsRoutes);
app.use('/api', authMiddleware, messageRoutes);
app.use('/api', activateRoutes);
app.use(errorMiddleware);
const server: any = http.createServer(app);

module.exports.server = server;