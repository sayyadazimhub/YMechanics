import { addMechanicDal, getMechanicByUsernameDal, getMechanicByPhoneDal, getAllStatesDal, getCitiesByStateDal, seedLocationsDal } from "../dal/mechanics_dal";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const registerMechanicService = async (mechanicData) => {
    try {
        // Check if username already exists
        const existingUser = await getMechanicByUsernameDal(mechanicData.username);
        if (existingUser) {
            return { message: "Username already exists", statusCode: "400" };
        }

        // Check if phone already exists
        const existingPhone = await getMechanicByPhoneDal(mechanicData.phone);
        if (existingPhone) {
            return { message: "Phone number already registered", statusCode: "400" };
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mechanicData.password, salt);
        mechanicData.password = hashedPassword;
        mechanicData.role = 'MECHANIC';

        const newMechanic = await addMechanicDal(mechanicData);
        // Exclude password from response
        const { password, ...mechanicWithoutPassword } = newMechanic;

        return { message: "Mechanic registered successfully", statusCode: "201", data: mechanicWithoutPassword };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const loginMechanicService = async (credentials) => {
    try {
        const mechanic = await getMechanicByUsernameDal(credentials.username);
        if (!mechanic) {
            return { message: "Invalid credentials", statusCode: "401" };
        }

        const isMatch = await bcrypt.compare(credentials.password, mechanic.password);
        if (!isMatch) {
            return { message: "Invalid credentials", statusCode: "401" };
        }

        if (!mechanic.is_active) {
            return { message: "Account is inactive", statusCode: "403" };
        }

        const token = jwt.sign(
            { id: mechanic.id, username: mechanic.username, role: mechanic.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password, ...mechanicWithoutPassword } = mechanic;
        return { message: "Login successful", statusCode: "200", data: { mechanic: mechanicWithoutPassword, token } };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const getStatesService = async () => {
    try {
        let states = await getAllStatesDal();
        return { message: "States fetched successfully", statusCode: "200", data: states };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};

export const getCitiesService = async (stateId) => {
    try {
        const cities = await getCitiesByStateDal(stateId);
        return { message: "Cities fetched successfully", statusCode: "200", data: cities };
    } catch (error) {
        return { message: error.message, statusCode: "500" };
    }
};
