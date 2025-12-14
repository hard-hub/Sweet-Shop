import { prisma } from './prisma';
import { hashPassword } from '../utils/password';

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Seed Admin User
    const adminEmail = 'admin@sweetshop.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await hashPassword('admin123');
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin user created');
    } else {
        console.log('ℹ️ Admin user already exists');
    }

    // 2. Seed Sweets
    const sweets = [
        {
            name: 'Dark Chocolate Truffle',
            category: 'Chocolates',
            price: 2.50,
            quantity: 100,
        },
        {
            name: 'Gummy Bears',
            category: 'Candy',
            price: 1.20,
            quantity: 200,
        },
        {
            name: 'Mint Lozenges',
            category: 'Hard Candy',
            price: 0.50,
            quantity: 500,
        },
        {
            name: 'Lava Cake',
            category: 'Baked Goods',
            price: 5.00,
            quantity: 20,
        },
        {
            name: 'Sour Worms',
            category: 'Candy',
            price: 1.50,
            quantity: 150,
        },
    ];

    for (const sweet of sweets) {
        const exists = await prisma.sweet.findFirst({ where: { name: sweet.name } });
        if (!exists) {
            await prisma.sweet.create({ data: sweet });
            console.log(`✅ Created sweet: ${sweet.name}`);
        } else {
            console.log(`ℹ️ Sweet already exists: ${sweet.name}`);
        }
    }

    console.log('🌱 Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
