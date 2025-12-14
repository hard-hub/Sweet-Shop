import { Request, Response, NextFunction } from 'express';
import { PurchasesService } from './purchases.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const purchasesService = new PurchasesService();

export const purchaseSweet = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const sweetId = req.params.id;
        const { quantity } = req.body;

        if (!userId) {
            // Should be caught by auth middleware, but safety check
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const purchase = await purchasesService.purchaseSweet(userId, sweetId, quantity);
        res.status(201).json({ message: 'Purchase successful', purchase });
    } catch (error) {
        next(error);
    }
};
