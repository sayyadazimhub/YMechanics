import { SignJWT, jwtVerify } from 'jose';

const SECRET = process.env.JWT_SECRET || 'default-secret-key-change-me';
const secretKey = new TextEncoder().encode(SECRET);

// Generate Token
export const signToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
};

// Verify Token
export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
};

// import jwt from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET || "mysecretkey";


// /* Generate JWT */
// export const signToken = (payload) => {

//     return jwt.sign(payload, SECRET, {
//         expiresIn: "1d"
//     });
// };


// /* Verify JWT */
// export const verifyToken = (token) => {

//     try {
//         return jwt.verify(token, SECRET);
//     } catch (err) {
//         return null;
//     }
// };
