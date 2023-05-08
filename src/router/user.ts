import express, { Request, Response, Router } from 'express'
import { Payload } from '.'
import { verifyToken } from '../middleware/verifyToken'
import { Users } from '../models/user'
import {
    addUserInChatList,
    getUserChatListById
} from '../services/userServices'

const user: Router = express.Router()

// API: Getting Chat List of loggedIn user
user.get(
    '/:id/chat-lists',
    verifyToken,
    async (req: Request & Payload, res: Response) => {
        try {
            if (req.payload?.id !== req.params.id) {
                res.status(400).send('Bad Request')
            } else {
                const result = await getUserChatListById(req.params.id)
                res.status(200).send(result)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
)

// API: Adding user to Chat List
user.post(
    '/add-to-chat-lists',
    verifyToken,
    async (req: Request & Payload, res: Response) => {
        const { loggedInUserId, friendId } = req.body

        if (!loggedInUserId && !friendId) {
            res.status(400).send('Bad Request')
        }
        if (req.payload?.id !== loggedInUserId) {
            res.status(400).send('Bad Request')
        } else {
            const result = await addUserInChatList(loggedInUserId, friendId)
            res.status(result.statusCode).send(result.message)
        }
    }
)

export default user
