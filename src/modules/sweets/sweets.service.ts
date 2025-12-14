import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';

export class SweetsService {
    async createSweet(data: any) {
        return await prisma.sweet.create({
            data: {
                name: data.name,
                category: data.category,
                price: data.price,
                quantity: data.quantity,
            },
        });
    }

    async getAllSweets() {
        return await prisma.sweet.findMany({
            where: {
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getSweetById(id: string) {
        const sweet = await prisma.sweet.findUnique({
            where: { id },
        });

        if (!sweet || sweet.isDeleted) {
            throw new AppError('Sweet not found', 404);
        }

        return sweet;
    }

    async updateSweet(id: string, data: any) {
        // Check existence
        await this.getSweetById(id);

        return await prisma.sweet.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    async deleteSweet(id: string) {
        await this.getSweetById(id);

        return await prisma.sweet.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
    }
}
