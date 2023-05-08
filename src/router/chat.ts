import express, { Request, Response, Router } from 'express'
import { Payload } from '.'
import { verifyToken } from '../middleware/verifyToken'
import { chatHistory, changeMessageStatus } from '../services/chatServices'

const router: Router = express.Router()

// API: Getting Chat between two users
router.get('/', verifyToken, async (req: Request & Payload, res: Response) => {
    const { to, from } = req.query

    if (req.payload?.id !== to) {
        res.status(400).send('Bad Request')
    }

    if (typeof to == 'string' && typeof from == 'string') {
        const privateChat = await chatHistory(to, from)

        res.send(privateChat)
    } else {
        res.status(400).send('Bad Request')
    }
})

// API: Set Read messages
router.put(
    '/read-messages',
    verifyToken,
    async (req: Request & Payload, res: Response) => {
        const { from, to } = req.query

        if (req.payload?.id !== to) {
            res.status(400).send('Bad Request')
        }

        if (typeof from == 'string' && typeof to == 'string') {
            const success = await changeMessageStatus(from, to)
            if (success) {
                res.send('Successfully updated message status')
            } else {
                res.send('error when updating message status')
            }
        } else {
            res.send('bad request')
        }
    }
)

export default router
