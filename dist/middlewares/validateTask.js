"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTask = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const validateCreateTask = (req, _res, next) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
        return next(new AppError_1.default('A valid task title is required and cannot be empty', 400));
    }
    req.body.title = title.trim();
    next();
};
exports.validateCreateTask = validateCreateTask;
exports.default = exports.validateCreateTask;
