import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
// import roomsRouter from './routes/rooms';
// const errorMiddleware = require("./middlewares/error-middleware");
// const authMiddleware = require("./middlewares/auth-middleware");

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
// app.use("/api", authMiddleware, roomsRoutes);
// app.use(errorMiddleware);
export default http.createServer(app);
