import { addMechanicDal, getMechanicByUsernameDal, getMechanicByEmailDal, saveResetOtpDal, getMechanicByOtpDal, clearOtpDal, getMechanicByPhoneDal, getAllStatesDal, getCitiesByStateDal, seedLocationsDal, activateMechanicDal, updateMechanicOtpDal } from "../dal/mechanics_dal";
import prisma from "@/lib/prisma";
import { sendOTPEmail, sendResetPasswordEmail } from "@/lib/email";
import { generateOTP } from "@/lib/otp";
import { addUser, updateUserDal } from "../dal/users_dal";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';


// export const registerMechanicService = async (mechanicData) => {
//   try {

//     if (!mechanicData.distance || mechanicData.distance <= 0) {
//       return {
//         message: "Service distance is required",
//         statusCode: "400"
//       };
//     }

//     const existingUser = await getMechanicByUsernameDal(mechanicData.username);
//     if (existingUser) {
//       return { message: "Username exists", statusCode: "400" };
//     }

//     const existingPhone = await getMechanicByPhoneDal(mechanicData.phone);
//     if (existingPhone) {
//       return { message: "Phone exists", statusCode: "400" };
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(mechanicData.password, salt);

//     const finalData = {
//       ...mechanicData,

//       password: hashedPassword,

//       role: "MECHANIC",

//       is_active: true,

//       distance: Number(mechanicData.distance), // ✅ USER DEFINED

//       latitude: Number(mechanicData.latitude),
//       longitude: Number(mechanicData.longitude)
//     };

//     const newMechanic = await addMechanicDal(finalData);

//     const { password, ...safe } = newMechanic;

//     return {
//       message: "Registered successfully",
//       statusCode: "201",
//       data: safe
//     };

//   } catch (err) {

//     console.error(err);

//     return {
//       message: "Registration failed",
//       statusCode: "500"
//     };
//   }
// };


export const registerMechanicService = async (mechanicData) => {
    try {

        if (!mechanicData.distance || mechanicData.distance <= 0) {
            return {
                message: "Service distance is required",
                statusCode: "400"
            };
        }
        // ✅ Generate OTP
        const otp = generateOTP();

        // ✅ Expire in 5 minutes
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);


        const existingUser = await getMechanicByUsernameDal(mechanicData.username);
        if (existingUser) {
            return { message: "Username exists", statusCode: "400" };
        }

        const existingPhone = await getMechanicByPhoneDal(mechanicData.phone);
        if (existingPhone) {
            return { message: "Phone exists", statusCode: "400" };
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mechanicData.password, salt);

        // ================= MECHANIC DATA =================
        const finalData = {
            ...mechanicData,

            password: hashedPassword,
            role: "MECHANIC",
            is_active: false, // Set to false initially for verification

            otp,
            otpExpiresAt: otpExpires,

            distance: Number(mechanicData.distance),

            latitude: Number(mechanicData.latitude),
            longitude: Number(mechanicData.longitude)
        };

        // ✅ Create mechanic
        const newMechanic = await addMechanicDal(finalData);

        // ================= USER DATA =================
        const userData = {
            name: mechanicData.name,
            username: mechanicData.username,
            password: hashedPassword,

            role: "MECHANIC",
            is_active: false,

            createdAt: new Date(),
            updatedAt: new Date()
        };

        // ✅ Create user
        await addUser(userData);

        // ✅ Send OTP email
        await sendOTPEmail(mechanicData.username, otp, mechanicData.name);

        // Remove password
        const { password, ...safe } = newMechanic;

        return {
            message: "Registered successfully",
            statusCode: "201",
            data: safe
        };

    } catch (err) {

        console.error(err);

        return {
            message: "Registration failed",
            statusCode: "500"
        };
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


export const verifyMechanicService = async (username, otp) => {
    try {
        const mechanic = await getMechanicByUsernameDal(username);

        if (!mechanic) {
            return { message: "Mechanic not found", statusCode: "404" };
        }

        if (mechanic.is_active) {
            return { message: "Already verified", statusCode: "200" };
        }

        if (mechanic.otp !== otp) {
            return { message: "Invalid OTP", statusCode: "400" };
        }

        if (new Date() > new Date(mechanic.otpExpiresAt)) {
            return { message: "OTP expired", statusCode: "400" };
        }

        // ✅ Activate Mechanic
        await activateMechanicDal(mechanic.id);

        // ✅ Activate User (Sync)
        const user = await prisma.users.findUnique({ where: { username } });
        if (user) {
            await prisma.users.update({
                where: { id: user.id },
                data: { is_active: true }
            });
        }

        return { message: "Email verified successfully", statusCode: "200" };

    } catch (error) {
        console.error(error);
        return { message: "Verification failed", statusCode: "500" };
    }
};

export const resendMechanicOtpService = async (username) => {
    try {
        const mechanic = await getMechanicByUsernameDal(username);

        if (!mechanic) {
            return { message: "Mechanic not found", statusCode: "404" };
        }

        if (mechanic.is_active) {
            return { message: "Account already verified", statusCode: "400" };
        }

        // ✅ Generate New OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        // ✅ Update DB
        await updateMechanicOtpDal(mechanic.id, otp, otpExpires);

        // ✅ Send Email
        await sendOTPEmail(mechanic.username, otp, mechanic.name);

        return { message: "OTP resent successfully", statusCode: "200" };

    } catch (error) {
        console.error(error);
        return { message: "Resend failed", statusCode: "500" };
    }
};

// // ===== SEND RESET EMAIL =====
// export const forgotPasswordService = async (email) => {

//   const user = await getMechanicByEmailDal(email);

//   if (!user) {
//     return { message: 'Email not found', statusCode: 404 };
//   }

//   const token = crypto.randomBytes(32).toString('hex');

//   const expiry = new Date();
//   expiry.setHours(expiry.getHours() + 1);

//   await saveResetTokenDal(user.id, token, expiry);

//   const resetLink =
//     `${process.env.APP_URL}/mechanic/reset-password?token=${token}`;

//   // ✅ Use separate function
//   await sendResetPasswordEmail(
//     email,
//     user.name,
//     resetLink
//   );

//   return {
//     message: 'Reset link sent to your email',
//     statusCode: 200
//   };
// };



// // ===== RESET PASSWORD =====
// export const resetPasswordService = async (token, password) => {

//   const user = await getByResetTokenDal(token);

//   if (!user) {
//     return { message: 'Invalid / Expired Token', statusCode: 400 };
//   }

//   const hashed = await bcrypt.hash(password, 10);

//   await updatePasswordDal(user.id, hashed);

//   return { message: 'Password updated', statusCode: 200 };
// };



// Send OTP
export const forgotPasswordService = async (mechanic) => {

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await saveResetOtpDal(mechanic.id, otp, expiry);

  await sendResetPasswordEmail(mechanic.email, otp, mechanic.name);

};


// Reset Password

export const resetPasswordService = async (email, otp, newPassword) => {

  const mechanic = await prisma.mechanic.findFirst({

    where: {
      email: email,
      otp: otp,
      otpExpiresAt: {
        gt: new Date() // not expired
      }
    }

  });

  if (!mechanic) {
    throw new Error("Invalid or expired OTP");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.mechanic.update({

    where: { id: mechanic.id },

    data: {
      password: hashed,
      otp: null,
      otpExpiresAt: null
    }

  });

  return true;
};


export const verifyResetOtpService = async (email, otp) => {

  const mechanic = await getMechanicByEmailDal(email);

  if (!mechanic) {
    throw new Error("User not found");
  }

  if (mechanic.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > mechanic.otpExpiresAt) {
    throw new Error("OTP expired");
  }

  // ❌ DO NOT CLEAR HERE

  return {
    id: mechanic.id,
    verified: true
  };
};
