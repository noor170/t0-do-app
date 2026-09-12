"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/tasks', taskRoutes_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: { message: `Cannot ${req.method} ${req.originalUrl}` },
    });
});
app.use(errorHandler_1.default);
exports.default = app;
