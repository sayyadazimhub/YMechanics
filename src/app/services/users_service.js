import { addUser, getAllUsers, getUserByUsername, getUserById, updateUserDal, updatePasswordDal } from "../dal/users_dal";
import bcrypt from 'bcryptjs';

export const addUserService = async (userData) => {
    try {
        const user = await getUserByUsername(userData.username);
        console.log("Existing user:", user);
        if (user) {
            return { message: "Username already exists", statusCode: "202" };
        }
        // Allow all valid roles: CUSTOMER, MECHANIC, ADMIN
        const validRoles = ['CUSTOMER', 'MECHANIC', 'ADMIN'];
        if (!validRoles.includes(userData.role)) {
            return { message: "Invalid role. Must be CUSTOMER, MECHANIC, or ADMIN", statusCode: "203" };
        }
        const { password } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        userData.password = hashedPassword;

        const newUser = await addUser(userData);
        return { message: "User added successfully", statusCode: "201", data: newUser };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const getAllUsersService = async () => {
    try {
        const users = await getAllUsers();
        return { message: "Users retrieved successfully", statusCode: "200", data: users };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};


export const getUsersService = async (skip, take) => {
    try {
        const users = await getAllUsers(skip ? skip : 0, take ? take : 10);
        return { message: "Users fetched successfully", statusCode: "200", data: users };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const updateUserService = async (userId, userData) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return { message: "User not found", statusCode: "404" };
        }
        const updatedUser = await updateUserDal(userId, userData);
        return { message: "User updated successfully", statusCode: "200", data: updatedUser };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
}

export const updatePasswordService = async (userId, newPassword) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return { message: "User not found", statusCode: "404" };
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await updatePasswordDal(userId, hashedPassword);
        return { message: "Password updated successfully", statusCode: "200", data: updatedUser };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
}
