/// <reference types="jest" />

import request from 'supertest';
import app from '../app';
import prisma from '../utils/prisma';

describe('Express & Prisma Integration Tests', () => {
  const testUserEmail = `developer3@example.com`;
  let createdTaskId: string;

  // Clean up database or disconnect handles after tests finish
  afterAll(async () => {
    await prisma.task.deleteMany({ where: { user: { email: testUserEmail } } });
    await prisma.user.deleteMany({ where: { email: testUserEmail } });
    await prisma.$disconnect();
  });

  // 1. User Signup / Creation Test
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: testUserEmail, password: 'securepassword123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe(testUserEmail);
  });

  // 2. Zod Validation Error Test (Task Creation)
  it('should reject task creation due to Zod validation failures', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Hi', email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  // 3. Task Creation Failure: User Not Found
  it('should fail task creation if user email does not exist', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .send({
        title: 'Orphaned Task',
        email: 'nonexistent@example.com',
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('User not found');
  });

  // 4. Task Creation Happy Path Test (Relational Mapping via Email)
  it('should create a task and link it to the user via email lookup', async () => {
    const res = await request(app)
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
    
    // Save ID for update tests
    createdTaskId = res.body.data.id;
  });
let paginationUser: any;
beforeAll(async () => {
    paginationUser = await prisma.user.create({
      data: {
        email: `pagination-owner-${Date.now()}@example.com`,
        password: 'password123',
      },
    });

    const tasks = Array.from({ length: 12 }).map((_, index) => ({
      title: `Task Item ${index + 1}`,
      description: `Description for task ${index + 1}`,
      userId: paginationUser.id,
    }));

    await prisma.task.createMany({ data: tasks });
  });

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { userId: paginationUser.id } });
    await prisma.user.delete({ where: { id: paginationUser.id } });
    await prisma.$disconnect();
  });

it('should return paginated results with default limit when query params are provided', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .query({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      .set('x-user-email', testUserEmail);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveLength(5);
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toEqual({
      total: 14,
      page: 1,
      limit: 5,
      totalPages: 3,
    });
  });
  // 5. Task Update Happy Path Test
  it('should update an existing task successfully', async () => {
    const res = await request(app)
      .put(`/api/v1/tasks/${createdTaskId}`)
      .send({
        title: 'Mastering Supertest Advanced',
        completed: true,
        email: testUserEmail,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Mastering Supertest Advanced');
    expect(res.body.data.completed).toBe(true);
  });

  // 6. Task Update Failure: Task Not Found
  it('should return 404 when trying to update a non-existent task', async () => {
    const res = await request(app)
      .put('/api/v1/tasks/non-existent-task-id-999')
      .send({
        title: 'Ghost Update',
        email: testUserEmail,
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('does not exist');
  });
});