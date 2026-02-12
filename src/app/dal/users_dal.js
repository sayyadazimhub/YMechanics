import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/* -------- CREATE USER -------- */
export const addUser = async (data) => {

    return await prisma.users.create({
        data
    });
};


/* -------- GET USERS -------- */
export const getAllUsers = async (skip = 0, take = 10) => {

    return await prisma.users.findMany({
        skip,
        take,
        orderBy: {
            createdAt: 'desc'
        }
    });
};


/* -------- GET BY USERNAME -------- */
export const getUserByUsername = async (username) => {

    return await prisma.users.findUnique({
        where: { username }
    });
};


/* -------- GET BY ID -------- */
export const getUserById = async (id) => {

    return await prisma.users.findUnique({
        where: { id }
    });
};


/* -------- UPDATE USER -------- */
export const updateUserDal = async (id, data) => {

    return await prisma.users.update({
        where: { id },
        data: {
            name: data.name,
            is_active: data.is_active
        }
    });
};
