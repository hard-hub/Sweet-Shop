import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Module', () => {

    // Cleanup before running tests (optional depending on strategy)
    beforeAll(async () => {
        // In a real scenario, we might connect to a test DB
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app).post('/api/auth/register').send({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            expect(res.body.user).not.toHaveProperty('password'); // Password should not be returned
        });

        it('should fail if email is already registered', async () => {
            // Create user first (assuming previous test might not persist or order isn't guaranteed, 
            // but usually we rely on flow or seeded data. For now, create duplicate request)

            // Note: Ideally we mock the service or stick to pure blackbox. 
            // If blackbox, we rely on the previous test or create one here.
            // Let's assume the DB persists for this suite or we verify conflict logic.

            await request(app).post('/api/auth/register').send({
                email: 'duplicate@example.com',
                password: 'password123',
            });

            const res = await request(app).post('/api/auth/register').send({
                email: 'duplicate@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(409); // Conflict
            expect(res.body).toHaveProperty('message', 'Email already exists');
        });

        it('should fail validation if email is invalid', async () => {
            const res = await request(app).post('/api/auth/register').send({
                email: 'invalid-email',
                password: '123',
            });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeAll(async () => {
            // Ensure user exists for login
            await request(app).post('/api/auth/register').send({
                email: 'login@example.com',
                password: 'password123',
            });
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'login@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'login@example.com',
                password: 'wrongpassword',
            });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });

        it('should fail with non-existent user', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(401);
        });
    });
});
