import jwt from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const generateToken = async (payload, expiresIn = '1d') => {
    const alg = 'HS256';
    const secret = new TextEncoder().encode(SECRET_KEY);
    const token = await new jwt.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setExpirationTime(expiresIn)
        .sign(secret);
    return token;
}
export const verifyToken = async (token) => {
    try {
        const secret = new TextEncoder().encode(SECRET_KEY);
        const { payload } = await jwt.jwtVerify(token, secret);
        return payload;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export const decodeToken = (token) => {
    try {
        const decoded = jwt.decodeJwt(token);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}



