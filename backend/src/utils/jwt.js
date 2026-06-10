import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = async (payload) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Payload must be a valid object');
    }
    if (!payload.id || !payload.email || !payload.role) {
        throw new Error('Payload must contain id, email, and role');
    }
    let token = jwt.sign(payload, SECRET, { expiresIn: '1d', algorithm: 'HS256' });
    // We must place token in the database for later verification
    await prisma.user.update({
        where: { id: payload.id },
        data: { userToken: token },
    });
    return token;
}

export const verifyToken = (token) =>
  jwt.verify(token, SECRET);