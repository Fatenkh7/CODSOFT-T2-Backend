import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export default function adminAuth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    try {
        const verified = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
        console.log('Token verified successfully:userrrrr', verified);
        req.admin = verified;
        console.log("userrr", req.admin)
        // Check if the user has the 'user' or 'admin' role
        if (verified.role === 'admin') {
            next();
        } else {
            return res.status(403).send('Access Denied: User or admin role required');
        }
    } catch (err) {
        res.status(403).json({ message: 'Invalid token', error: err.message });
    }
}
