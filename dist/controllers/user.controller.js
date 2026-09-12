"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const createUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError_1.default('Email and password are required', 400));
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new AppError_1.default('Email already in use', 409));
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: { email, password: hashedPassword },
            select: { id: true, email: true, createdAt: true },
        });
        return res.status(201).json({ success: true, data: newUser });
    }
    catch (error) {
        return next(new AppError_1.default('Failed to create user', 500));
    }
};
exports.createUser = createUser;
