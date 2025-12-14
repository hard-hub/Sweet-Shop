import app from './app';
import dotenv from 'dotenv';
import { prisma } from './config/prisma';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to Database');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

main();
