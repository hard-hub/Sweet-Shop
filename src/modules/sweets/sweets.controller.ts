import { Request, Response, NextFunction } from 'express';
import { SweetsService } from './sweets.service';

const sweetsService = new SweetsService();

export const createSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sweet = await sweetsService.createSweet(req.body);
        res.status(201).json(sweet);
    } catch (error) {
        next(error);
    }
};

export const getAllSweets = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sweets = await sweetsService.getAllSweets();
        res.status(200).json(sweets);
    } catch (error) {
        next(error);
    }
};

export const updateSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sweet = await sweetsService.updateSweet(req.params.id, req.body);
        res.status(200).json(sweet);
    } catch (error) {
        next(error);
    }
};

export const deleteSweet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await sweetsService.deleteSweet(req.params.id);
        res.status(200).json({ message: 'Sweet deleted successfully' });
    } catch (error) {
        next(error);
    }
};
