import request from 'supertest';
import app from '../app';
import { prisma } from '../config/prisma';
import jwt from 'jsonwebtoken';

describe('Sweets Module', () => {
    let adminToken: string;
    let userToken: string;
    let sweetId: string;

    beforeAll(async () => {
        // Setup Admin User
        const admin = await prisma.user.create({
            data: {
                email: 'admin@sweetshop.com',
                password: 'hashedpassword', // In real integration tests, use helper to hash
                role: 'ADMIN',
            },
        });

        adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET || 'secret');

        // Setup Normal User
        const user = await prisma.user.create({
            data: {
                email: 'user@sweetshop.com',
                password: 'hashedpassword',
                role: 'USER',
            },
        });

        userToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
    });

    afterAll(async () => {
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    describe('POST /api/sweets', () => {
        it('should allow Admin to create a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Fudge',
                    category: 'Chocolates',
                    price: 5.99,
                    quantity: 100,
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('Chocolate Fudge');
            sweetId = res.body.id;
        });

        it('should forbid User from creating a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Forbidden Candy',
                    category: 'Candy',
                    price: 1.00,
                    quantity: 10,
                });

            expect(res.status).toBe(403);
        });
    });

    describe('GET /api/sweets', () => {
        it('should list all available sweets', async () => {
            const res = await request(app).get('/api/sweets');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should allow Admin to update a sweet', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    price: 6.99,
                });

            expect(res.status).toBe(200);
            expect(res.body.price).toBe('6.99');
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        it('should soft delete a sweet', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Sweet deleted successfully');

            // Verify soft delete in DB
            const deletedSweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
            expect(deletedSweet?.isDeleted).toBe(true);
        });

        it('should not list deleted sweets in GET', async () => {
            const res = await request(app).get('/api/sweets');
            const found = res.body.find((s: any) => s.id === sweetId);
            expect(found).toBeUndefined();
        });
    });
});
