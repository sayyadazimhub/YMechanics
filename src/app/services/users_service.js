import {
    addUser,
    getAllUsers,
    getUserById,
    updateUserDal,
    getUserByUsername
} from "../dal/users_dal";


import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

/* ---------------- ADD USER ---------------- */
export const addUserService = async (data) => {

    const exist = await getUserByUsername(data.username);

    if (exist) {
        return { statusCode: "409", message: "Username already exists" };
    }

    const hash = await bcrypt.hash(data.password, 10);

    data.password = hash;

    const user = await addUser(data);

    return {
        statusCode: "201",
        message: "User created",
        data: user
    };
};


/* ---------------- LOGIN ---------------- */
export const loginService = async (data) => {

    const user = await getUserByUsername(data.username);

    if (!user) {
        return { statusCode: "404", message: "User not found" };
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
        return { statusCode: "401", message: "Invalid password" };
    }

    const token = await signToken({
        id: user.id,
        role: user.role
    });

    return {
        statusCode: "200",
        message: "Login success",
        token,
        user
    };
};


/* ---------------- GET USERS ---------------- */
export const getUsersService = async (skip = 0, take = 10) => {

    const users = await getAllUsers(skip, take);

    return {
        statusCode: "200",
        message: "Users fetched",
        data: users
    };
};


/* ---------------- UPDATE USER ---------------- */
export const updateUserService = async (id, data) => {

    const user = await getUserById(id);

    if (!user) {
        return {
            statusCode: "404",
            message: "User not found"
        };
    }

    const updated = await updateUserDal(id, {
        name: data.name,
        is_active: data.is_active
    });

    return {
        statusCode: "200",
        message: "User updated",
        data: updated
    };
};


export const updateUserOtpDal = async (username, otp) => {
  try {

    // ✅ Find user by email/username
    const user = await prisma.users.findUnique({
      where: {
        username: username
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // ❌ Already verified
    if (user.isVerified) {
      throw new Error("User already verified");
    }

    // ❌ OTP expired
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new Error("OTP expired");
    }

    // ❌ OTP mismatch
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    console.error("OTP Update Error:", error);
    throw error;
  }
};