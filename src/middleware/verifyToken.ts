import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'mysecretkey'

export const verifyToken = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, SECRET_KEY)

        req.payload = decoded
        return next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}
