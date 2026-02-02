import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addCityDal = async (cityData) => {
    return await prisma.cities.create({
        data: cityData
    });
};

export const getAllCitiesDal = async () => {
    return await prisma.cities.findMany({
        include: { state: true },
        orderBy: { name: 'asc' }
    });
};

export const getCitiesByStateDal = async (state_id) => {
    return await prisma.cities.findMany({
        where: { state_id },
        orderBy: { name: 'asc' }
    });
};

export const getCityByIdDal = async (id) => {
    return await prisma.cities.findUnique({
        where: { id },
        include: { state: true }
    });
};

export const updateCityDal = async (id, cityData) => {
    return await prisma.cities.update({
        where: { id },
        data: cityData
    });
};

export const deleteCityDal = async (id) => {
    return await prisma.cities.delete({
        where: { id }
    });
};
