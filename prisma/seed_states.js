const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const statesData = [
    { "code": "TG", "name": "Telangana" },
    { "code": "TN", "name": "Tamil Nadu" },
    { "code": "TR", "name": "Tripura" },
    { "code": "UP", "name": "Uttar Pradesh" },
    { "code": "UT", "name": "Uttarakhand" },
    { "code": "WB", "name": "West Bengal" }
];

async function main() {
    console.log('Seeding states...');
    for (const state of statesData) {
        await prisma.states.upsert({
            where: { code: state.code },
            update: {},
            create: {
                code: state.code,
                name: state.name
            }
        });
    }
    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
