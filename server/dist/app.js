"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
// import roomsRouter from './routes/rooms';
// const errorMiddleware = require("./middlewares/error-middleware");
// const authMiddleware = require("./middlewares/auth-middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_1.default);
// app.use("/api", authMiddleware, roomsRoutes);
// app.use(errorMiddleware);
exports.default = http_1.default.createServer(app);
//# sourceMappingURL=app.js.map