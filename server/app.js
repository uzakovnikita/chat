const express = require("express");
const cors = require("cors");
const http = require("http");
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/auth', authRoutes);
const server = http.createServer(app);

module.exports.server = server;