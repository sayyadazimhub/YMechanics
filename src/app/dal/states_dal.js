import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addStateDal = async (stateData) => {
    return await prisma.states.create({
        data: stateData
    });
};

export const getAllStatesDal = async () => {
    return await prisma.states.findMany({
        orderBy: { name: 'asc' }
    });
};

export const getStateByIdDal = async (id) => {
    return await prisma.states.findUnique({
        where: { id }
    });
};

export const updateStateDal = async (id, stateData) => {
    return await prisma.states.update({
        where: { id },
        data: stateData
    });
};

export const deleteStateDal = async (id) => {
    return await prisma.states.delete({
        where: { id }
    });
};
