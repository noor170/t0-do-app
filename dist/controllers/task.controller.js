"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const getAllTasks = async (_req, res, next) => {
    try {
        const tasks = await prisma_1.default.task.findMany();
        return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }
    catch (error) {
        return next(new AppError_1.default('Failed to fetch tasks', 500));
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const task = await prisma_1.default.task.findUnique({ where: { id } });
        if (!task) {
            return next(new AppError_1.default(`Task with ID ${id} does not exist`, 404));
        }
        return res.status(200).json({ success: true, data: task });
    }
    catch (error) {
        return next(new AppError_1.default('Failed to fetch task', 500));
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res, next) => {
    try {
        const { title, description, email } = req.body;
        if (!email) {
            return next(new AppError_1.default('User email is required to create a task', 400));
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return next(new AppError_1.default(`User with email ${email} not found`, 404));
        }
        const newTask = await prisma_1.default.task.create({
            data: {
                title,
                description,
                user: { connect: { id: user.id } },
            },
            include: { user: { select: { id: true, email: true } } },
        });
        return res.status(201).json({ success: true, data: newTask });
    }
    catch (error) {
        return next(new AppError_1.default('Failed to create task', 500));
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const updated = await prisma_1.default.task.update({
            where: { id },
            data: {
                ...(title !== undefined ? { title } : {}),
                ...(completed !== undefined ? { completed } : {}),
            },
        });
        return res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        if (err.code === 'P2025') {
            return next(new AppError_1.default(`Task with ID ${id} does not exist`, 404));
        }
        return next(new AppError_1.default('Failed to update task', 500));
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        await prisma_1.default.task.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Task deleted successfully' });
    }
    catch (err) {
        if (err.code === 'P2025') {
            return next(new AppError_1.default(`Task with ID ${id} does not exist`, 404));
        }
        return next(new AppError_1.default('Failed to delete task', 500));
    }
};
exports.deleteTask = deleteTask;
