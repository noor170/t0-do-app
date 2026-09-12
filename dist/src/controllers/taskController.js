"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
let tasks = [
    { id: '1', title: 'Learn Express Middleware', completed: false, createdAt: new Date() },
];
const getAllTasks = (_req, res) => {
    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
    });
};
exports.getAllTasks = getAllTasks;
const getTaskById = (req, res, next) => {
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) {
        return next(new AppError_1.default(`Task with ID ${req.params.id} does not exist`, 404));
    }
    res.status(200).json({
        success: true,
        data: task,
    });
};
exports.getTaskById = getTaskById;
const createTask = (req, res) => {
    const { title } = req.body;
    const newTask = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date(),
    };
    tasks.push(newTask);
    res.status(201).json({
        success: true,
        data: newTask,
    });
};
exports.createTask = createTask;
const updateTask = (req, res, next) => {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);
    if (taskIndex === -1) {
        return next(new AppError_1.default(`Task with ID ${req.params.id} does not exist`, 404));
    }
    const { title, completed } = req.body;
    if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
            return next(new AppError_1.default('A valid task title is required', 400));
        }
        tasks[taskIndex].title = title.trim();
    }
    if (completed !== undefined) {
        tasks[taskIndex].completed = Boolean(completed);
    }
    res.status(200).json({
        success: true,
        data: tasks[taskIndex],
    });
};
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);
    if (taskIndex === -1) {
        return next(new AppError_1.default(`Task with ID ${req.params.id} does not exist`, 404));
    }
    tasks.splice(taskIndex, 1);
    res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
    });
};
exports.deleteTask = deleteTask;
