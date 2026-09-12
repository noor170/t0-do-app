"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters long'),
    description: zod_1.z.string().optional(),
    email: zod_1.z.string().min(1, 'User email is required').email('Invalid email format'),
});
