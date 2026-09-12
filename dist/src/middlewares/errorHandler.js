"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Something went wrong',
            status: err.status || 'error',
        },
    });
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
