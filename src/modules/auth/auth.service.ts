import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../../utils/password';
import { AppError } from '../../utils/AppError';

// Handle Prisma Client mismatch if necessary, but assuming standard init now
import { prisma } from '../../config/prisma';

export class AuthService {
    async register(data: any) {
        const { email, password } = data;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError('Email already exists', 409);
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                // Default role is USER
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return { token };
    }
}
