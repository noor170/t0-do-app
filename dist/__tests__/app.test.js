"use strict";
/// <reference types="jest" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const prisma_1 = __importDefault(require("../utils/prisma"));
describe('Express & Prisma Integration Tests', () => {
    const testUserEmail = `developer@example.com`;
    // Clean up database or disconnect handles after tests finish
    afterAll(async () => {
        // Optional: Clean up test data to keep DB pristine
        await prisma_1.default.task.deleteMany({ where: { user: { email: testUserEmail } } });
        await prisma_1.default.user.deleteMany({ where: { email: testUserEmail } });
        // Crucial: Disconnect Prisma to prevent Jest open handle warnings
        await prisma_1.default.$disconnect();
    });
    // 1. User Signup / Creation Test
    it('should register a new user successfully', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send({ email: testUserEmail, password: 'securepassword123' });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.email).toBe(testUserEmail);
    });
    // 2. Zod Validation Error Test (Task Creation)
    it('should reject task creation due to Zod validation failures', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/tasks')
            .send({ title: 'Hi', email: 'not-an-email' }); // Invalid title length & bad email
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error.message).toBe('Validation failed');
        expect(res.body.error.details.length).toBeGreaterThan(0);
    });
    // 3. Task Creation Happy Path Test (Relational Mapping via Email)
    it('should create a task and link it to the user via email lookup', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/v1/tasks')
            .send({
            title: 'Mastering Supertest',
            description: 'Writing robust integration tests for Express',
            email: testUserEmail,
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Mastering Supertest');
        expect(res.body.data.user.email).toBe(testUserEmail);
    });
});
