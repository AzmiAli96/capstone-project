import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("Password123", 10);
    await prisma.user.createMany({
        data: [{
            name: 'Super Admin',
            email: 'admin@gmail.com',
            password: (hashedPassword)!,
            role: "admin",
            alamat: "Aur Kuning",
            no_hp: "082199175396"
        }],
        skipDuplicates: true
    },);

    console.log('User seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });