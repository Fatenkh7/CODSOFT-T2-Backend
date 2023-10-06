import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req, res, next) {
    const session = req.session;
    if (!session || !session.userId) {
        return res.status(401).send('Access Denied');
    }
    const userId = session.userId;
    req.user = { userId }; 
    next();
}
