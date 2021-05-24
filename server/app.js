const express = require("express");
const cors = require("cors");
const http = require("http");
const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/auth', authRoutes);
app.use('/api', roomsRoutes);
const server = http.createServer(app);

module.exports.server = server;