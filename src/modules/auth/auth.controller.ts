import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            // Basic validation
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
