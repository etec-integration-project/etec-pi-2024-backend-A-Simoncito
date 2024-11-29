import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const estaAutenticado = (req, res, next) => {
    const token = req.cookies["escudero-app"];

    console.log(token)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        return res.status(403).json({ mensaje: "No estás autenticado" });
    }

    try {
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ mensaje: "No estás autenticado" });
    }
}