import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config(); 
export const SECRET_KEY = process.env.SECRET_KEY;

export async function generateToken(user) {
    const token = jwt.sign({
        id: user.id,
        email:user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.created_at
    }, SECRET_KEY, { expiresIn: '72h' });
    return token;
}
