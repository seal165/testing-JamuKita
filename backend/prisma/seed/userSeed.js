import prisma from "../../src/lib/prisma.js";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
    const us = await prisma.user.upsert({
        where: { email: "us@example.com" },
        update: {},
        create: {
            name: "User",
            email: "us@example.com",
            password: await bcrypt.hash("123456", 10), // Hash the password
            role: "customer",
        },
    });
    const admin = await prisma.user.upsert({
        where: { email: "we@example.com" },
        update: {},
        create: {
            name: "Admin",
            email: "we@example.com",
            password: await bcrypt.hash("123456", 10), // Hash the password
            role: "admin",
        },
    });
    console.log("Seeded users:", { us, admin });
    return { us, admin };
};

const main = async () => {
    await seedUsers().catch((error) => {
        console.error("Error seeding users:", error);
        process.exit(1);
    });
    console.log("Seeding completed successfully.");
};

main();
// Close the Prisma client connection
prisma.$disconnect()
    .catch((error) => {
        console.error("Error disconnecting Prisma client:", error);
        process.exit(1);
    });