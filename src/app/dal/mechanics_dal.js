import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addMechanicDal = async (mechanicData) => {
    return await prisma.mechanic.create({
        data: mechanicData
    });
};

export const getMechanicByUsernameDal = async (username) => {
    return await prisma.mechanic.findUnique({
        where: { username }
    });
};

export const getMechanicByPhoneDal = async (phone) => {
    return await prisma.mechanic.findUnique({
        where: { phone }
    });
};

export const getAllStatesDal = async () => {
    return await prisma.states.findMany({
        orderBy: { name: 'asc' }
    });
};

export const getCitiesByStateDal = async (state_id) => {
    return await prisma.cities.findMany({
        where: { state_id },
        orderBy: { name: 'asc' }
    });
};

export const seedLocationsDal = async (data) => {
    for (const stateData of data) {
        let state = await prisma.states.findFirst({
            where: { name: stateData.name }
        });

        if (!state) {
            state = await prisma.states.create({
                data: { name: stateData.name }
            });
        }

        for (const cityName of stateData.cities) {
            const city = await prisma.cities.findFirst({
                where: { name: cityName, state_id: state.id }
            });

            if (!city) {
                await prisma.cities.create({
                    data: {
                        name: cityName,
                        state_id: state.id
                    }
                });
            }
        }
    }
};

