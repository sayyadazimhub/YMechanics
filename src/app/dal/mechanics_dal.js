import prisma from "@/lib/prisma";

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

export const activateMechanicDal = async (mechanicId) => {
    return await prisma.mechanic.update({
        where: { id: mechanicId },
        data: {
            is_active: true,
            otp: null,
            otpExpiresAt: null
        }
    });
};

export const updateMechanicOtpDal = async (mechanicId, otp, expiresAt) => {
    return await prisma.mechanic.update({
        where: { id: mechanicId },
        data: {
            otp,
            otpExpiresAt: expiresAt
        }
    });
};




// export const saveResetTokenDal = async (id, token, expiry) => {
//   return prisma.mechanic.update({
//     where: { id },
//     data: {
//       reset_token: token,
//       reset_expiry: expiry
//     }
//   });
// };

// export const getByResetTokenDal = async (token) => {
//   return prisma.mechanic.findFirst({
//     where: {
//       reset_token: token,
//       reset_expiry: { gt: new Date() }
//     }
//   });
// };

// export const updatePasswordDal = async (id, password) => {
//   return prisma.mechanic.update({
//     where: { id },
//     data: {
//       password,
//       reset_token: null,
//       reset_expiry: null
//     }
//   });
// };
export const getMechanicByEmailDal = async (username) => {
    return prisma.mechanic.findUnique({
        where: { username }
    });
};


export const saveResetOtpDal = async (id, otp, expiry) => {

    return await prisma.mechanic.update({

        where: { id },

        data: {
            otp,
            otpExpiresAt: expiry,
        },

    });

};

export const getMechanicByOtpDal = async (otp) => {

    return await prisma.mechanic.findFirst({

        where: {

            otp,

            otpExpiresAt: {
                gt: new Date(), // still valid
            },

        },

    });

};

export const clearOtpDal = async (id) => {

    return await prisma.mechanic.update({

        where: { id },

        data: {
            otp: null,
            otpExpiresAt: null,
        },

    });

};
