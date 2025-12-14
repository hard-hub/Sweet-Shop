import request from 'supertest';
import app from '../app';
import { prisma } from '../config/prisma';
import jwt from 'jsonwebtoken';

describe('Purchases Module', () => {
    let userToken: string;
    let adminToken: string;
    let sweetId: string;

    beforeAll(async () => {
        // Setup Users
        const user = await prisma.user.create({
            data: { email: 'buyer@test.com', password: 'hash', role: 'USER' },
        });
        userToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');

        const admin = await prisma.user.create({
            data: { email: 'admin@test.com', password: 'hash', role: 'ADMIN' },
        });
        adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET || 'secret');
    });

    beforeEach(async () => {
        // Reset sweet for each test
        await prisma.purchase.deleteMany();
        await prisma.sweet.deleteMany();

        const sweet = await prisma.sweet.create({
            data: {
                name: 'Test Sweet',
                category: 'Test',
                price: 10.00,
                quantity: 5, // Initial stock: 5
            },
        });
        sweetId = sweet.id;
    });

    afterAll(async () => {
        await prisma.purchase.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should purchase a sweet successfully and decrease stock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 2 });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Purchase successful');

            // Verify Stock
            const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
            expect(sweet?.quantity).toBe(3); // 5 - 2 = 3

            // Verify Purchase Record
            const purchase = await prisma.purchase.findFirst({ where: { sweetId } });
            expect(purchase).toBeTruthy();
            expect(purchase?.quantity).toBe(2);
            expect(Number(purchase?.priceAtPurchase)).toBe(10.00); // Snapshot price
        });

        it('should fail if stock is insufficient', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 10 }); // Only 5 available

            expect(res.status).toBe(400); // Or 409 depending on design choice
            expect(res.body.message).toMatch(/Insufficient stock/i);

            // Verify Stock Unchanged
            const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
            expect(sweet?.quantity).toBe(5);
        });

        it('should fail if sweet is soft-deleted', async () => {
            // Soft delete the sweet first
            await prisma.sweet.update({ where: { id: sweetId }, data: { isDeleted: true } });

            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 1 });

            expect(res.status).toBe(404);
        });
    });
});
