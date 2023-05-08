import jwt from 'jsonwebtoken'
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'mysecretkey'

export interface User {
    id: string
    name: string
}

export const generateToken = (user: User) => {
    const payload = {
        id: user.id,
        username: user.name
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' })
}
