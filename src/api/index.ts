import express, { Express, Request, Response } from 'express'
import { createServer } from 'https'
import { Server } from 'socket.io'
import cors from 'cors'
import { uniqueRoomPrivateChat } from '../utils/uniqueRoomPrivateChat'
import { saveMessage } from '../services/chatServices'
import session from 'express-session'
import fs from 'fs'
import MongoStore from 'connect-mongo'

require('dotenv').config()
import('../dbConfig')

import router from '../router'
import path from 'path'
import passport from 'passport'
import helmet from 'helmet'

const app: Express = express()
const port = process.env.PORT || 9000

app.use(express.json())
app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:3000',
            'https://chat-application-two-eta.vercel.app'
        ],
        methods: ['GET,HEAD,PUT,PATCH,POST,DELETE']
    })
)
app.use(express.urlencoded({ extended: true }))
app.use(helmet())

app.use(
    session({
        secret: process.env.JWT_SECRET_KEY || 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongoUrl:
                process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp'
        })
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', router)

app.get('/', async (req: Request, res: Response) => {
    res.send('Chat App Running...')
})

const server = createServer(
    {
        key: fs.readFileSync(__dirname + '/../../server.key'),
        cert: fs.readFileSync(__dirname + '/../../server.cert')
    },
    app
)

const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:3000',
            'https://chat-application-two-eta.vercel.app'
        ],
        credentials: true,
        methods: ['GET,HEAD,PUT,PATCH,POST,DELETE']
    }
})

var allClients: { [key: string]: string } = {}

io.on('connection', (socket: any) => {
    // allClients.push(socket.id)
    // socket.on('join_room', (data) => {
    //     const { userName, room } = data // Data sent from client when join_room event emitted
    //     socket.join(room) // Join the user to a socket room
    //     let createdTime = Date.now() // Current timestamp
    //     // Send message to all users currently in the room, apart from the user that just joined
    //     io.to(room).emit('user_join_room', {
    //         message: `${userName} has joined the chat room`,
    //         from: userName,
    //         to: '',
    //         room: room,
    //         createdAt: createdTime,
    //         type: 'joined'
    //     })
    // })

    socket.on('login', (data: any) => {
        allClients[socket.id] = data.id
        let activeUsers = []
        for (const iterator of Object.values(allClients)) {
            activeUsers.push(iterator)
        }
        io.emit('online_users', activeUsers)
    })

    socket.on('user_join_private_chat', (data: any) => {
        const { room } = data
        const privateChatId = uniqueRoomPrivateChat(room)
        socket.join(privateChatId)
    })

    socket.on('private_message', (data: any) => {
        const { from, to, message, room } = data

        const privateChatId = uniqueRoomPrivateChat(room)
        socket.join(privateChatId)

        let createdTime = Date.now() // Current timestamp

        saveMessage({
            from,
            to,
            message,
            privateChatId: privateChatId,
            unread: true
        })

        io.emit('incoming_message', {
            from,
            to
        })

        io.to(privateChatId).emit('receive_private_message', {
            message,
            from,
            to,
            privateChatId: privateChatId,
            createdAt: createdTime,
            type: 'chat',
            unread: true
        })
    })
    socket.on('disconnect', () => {
        io.emit('offline', allClients[socket.id])

        delete allClients[socket.id]
        console.log(socket.id + ' ==== diconnected')
    })
})

server.listen(port, () => {
    return console.log(`Server is listening at https://localhost:${port}`)
})

export default app
