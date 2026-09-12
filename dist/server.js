"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
const PORT = process.env.PORT || 5000;
process.on('uncaughtException', (error) => {
    logger_1.logger.error(`UNCAUGHT EXCEPTION! Shutting down...\n${error.stack}`);
    process.exit(1);
});
const server = app_1.default.listen(PORT, () => {
    logger_1.logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error(`UNHANDLED REJECTION! Shutting down...\n${reason.stack || reason}`);
    server.close(() => {
        process.exit(1);
    });
});
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
