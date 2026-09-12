"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const morganStream = {
    write: (message) => logger_1.logger.http(message.trim()),
};
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));
app.use('/api/v1/tasks', task_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: { message: `Cannot ${req.method} ${req.originalUrl}` },
    });
});
app.use(errorHandler_1.default);
exports.default = app;
