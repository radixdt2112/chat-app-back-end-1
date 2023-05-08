import express, { Request, Response, Router } from 'express'
import chat from './chat'
import user from './user'
import auth from './auth'
import { Users } from '../models/user'

export interface Payload {
    payload?: {
        id: string
        username: string
    }
}
const router: Router = express.Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await Users.find()
        res.send(result)
    } catch (error) {
        res.send(JSON.stringify(error))
    }
    // res.send('Chat App Running...')
})

router.use('/auth', auth)
router.use('/chat', chat)
router.use('/user', user)

export default router
