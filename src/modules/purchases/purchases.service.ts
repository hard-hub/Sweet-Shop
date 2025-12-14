import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';

export class PurchasesService {
    async purchaseSweet(userId: string, sweetId: string, quantity: number) {
        if (quantity <= 0) {
            throw new AppError('Quantity must be greater than zero', 400);
        }

        // Use interactive transaction for atomicity
        return await prisma.$transaction(async (tx: any) => {
            // 1. Fetch Sweet to check availability and price
            const sweet = await tx.sweet.findUnique({
                where: { id: sweetId },
            });

            if (!sweet || sweet.isDeleted) {
                throw new AppError('Sweet not found', 404);
            }

            if (sweet.quantity < quantity) {
                throw new AppError(`Insufficient stock. Only ${sweet.quantity} left.`, 400);
            }

            // 2. Decrement Stock atomically
            await tx.sweet.update({
                where: { id: sweetId },
                data: {
                    quantity: {
                        decrement: quantity,
                    },
                },
            });

            // 3. Create Purchase Record with snapshot price
            const purchase = await tx.purchase.create({
                data: {
                    userId,
                    sweetId,
                    quantity,
                    priceAtPurchase: sweet.price,
                },
            });

            return purchase;
        });
    }
}
