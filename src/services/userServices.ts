import mongoose, { ObjectId } from 'mongoose'
import { PrivateChatModel } from '../models/privateChat'
import { Users } from '../models/user'
import { uniqueRoomPrivateChat } from '../utils/uniqueRoomPrivateChat'
import _ from 'lodash'
import { generateToken } from '../utils/generateToken'

export const createUser = async (name: string, email: string) => {
    try {
        const data = new Users({
            name: name,
            email: email,
            chatList: [],
            bio: null,
            image: null
        })

        const user = await Users.findOne({ email: email })
        if (!user) {
            const result = await data.save()
            if (result) {
                const token = generateToken({
                    id: result._id.toString(),
                    name: result.name
                })

                return {
                    token: token,
                    id: result._id.toString(),
                    name: result.name
                }
            } else {
                return { statusCode: 500, message: 'Unable to create user' }
            }
        } else {
            const token = generateToken({
                id: user._id.toString(),
                name: user.name
            })

            return {
                token: token,
                id: user._id.toString(),
                name: user.name
            }
        }
    } catch (e: unknown) {
        return {
            statusCode: 500,
            message: `Unable to create user \n ${JSON.stringify(e)}`
        }
    }
}
const updateUser = async (id: string) => {
    const result = await Users.findByIdAndUpdate(id, {
        $push: { contacts: '641be405d0924e3f35e813aa' }
    })
    console.log('createUser :>>', result)
}
const deleteUser = () => {}
const getUsers = () => {}

export const getUserByEmail = async (email: string) => {
    try {
        const result = await Users.find({
            email: email
        })
            .populate('chatList', '_id name')
            .select('name id')

        return result[0]
    } catch (err) {
        throw err
    }
}

export const getUserChatListById = async (
    id: string
): Promise<
    {
        _id: string
        name: string
        unReadMessagesCount: number
    }[]
> => {
    try {
        const result = await Users.findById(id)
            .populate('chatList', '_id name')
            .select('_id')

        if (result) {
            if (result.chatList && result.chatList.length > 0) {
                const privateChatIds: string[] = []
                const chatListObj: Record<
                    string,
                    { _id: string; name: string }
                > = {}
                const chatUsersId: string[] = []
                const response: {
                    _id: string
                    name: string
                    unReadMessagesCount: number
                }[] = []

                result.chatList.forEach((item: any) => {
                    if (!chatListObj[item._id]) {
                        chatListObj[item._id] = item
                    }
                    chatUsersId.push(item._id)
                    privateChatIds.push(
                        uniqueRoomPrivateChat(`${id}--with--${item._id}`)
                    )
                })

                const privateChatIdLatestRecords =
                    await PrivateChatModel.aggregate([
                        {
                            $match: {
                                privateChatId: {
                                    $in: privateChatIds
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        {
                            $group: {
                                _id: '$privateChatId',
                                latestRecord: { $first: '$$ROOT' } // Select the first document of each group (i.e., the last transaction)
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        {
                            $project: {
                                latestRecord: {
                                    from: 1,
                                    to: 1
                                }
                            }
                        }
                    ])
                // console.log('privateChatIdLatestRecords :>',privateChatIdLatestRecords)

                let to = new mongoose.Types.ObjectId(id)

                const unreadMessages = await PrivateChatModel.aggregate([
                    {
                        $match: {
                            to: to,
                            from: {
                                $in: chatUsersId
                            },
                            unread: true
                        }
                    },
                    {
                        $group: {
                            _id: '$from',
                            count: { $sum: 1 }
                        }
                    }
                ])
                // console.log('unreadMessages :>', unreadMessages)

                privateChatIdLatestRecords.forEach((item) => {
                    let findUnReadMessage = null
                    if (unreadMessages.length > 0) {
                        findUnReadMessage = unreadMessages.find(
                            (y) =>
                                y._id.toString() ===
                                item.latestRecord.from.toString()
                        )
                    }

                    if (!findUnReadMessage) {
                        let obj = {
                            _id:
                                item.latestRecord.from.toString() === id
                                    ? item.latestRecord.to.toString()
                                    : item.latestRecord.from.toString(),
                            name: chatListObj[
                                item.latestRecord.from.toString() === id
                                    ? item.latestRecord.to.toString()
                                    : item.latestRecord.from.toString()
                            ].name,
                            unReadMessagesCount: 0
                        }
                        response.push(obj)
                    } else {
                        response.push({
                            _id: item.latestRecord.from.toString(),
                            name: chatListObj[item.latestRecord.from].name,
                            unReadMessagesCount: findUnReadMessage.count
                        })
                    }
                })

                const chatIds = response.map((item) => item._id)
                const userIdInChatList = chatUsersId.map((item) =>
                    item.toString()
                )
                const uniqueId = _.difference(userIdInChatList, chatIds)

                uniqueId.forEach((item) => {
                    response.push({
                        _id: item,
                        name: chatListObj[item].name,
                        unReadMessagesCount: 0
                    })
                })
                return response
            }

            return []
        } else return []
    } catch (err) {
        throw err
    }
}

export const checkUserToInChatListOfFrom = async (
    user1: ObjectId,
    user2: ObjectId
) => {
    try {
        const findUser = await Users.findById(user2)
            .populate({
                path: 'chatList',
                match: { _id: user1 },
                select: '_id'
            })
            .select('_id')

        if (findUser && findUser.chatList && findUser.chatList.length === 0) {
            await Users.findByIdAndUpdate(user2, {
                $push: { chatList: user1 }
            })
        }
    } catch (err) {
        console.log(err)
    }
}
export type ResponseType = {
    statusCode: number
    message: string
}

export const addUserInChatList = async (
    loggedInUserId: string,
    friendId: string
): Promise<ResponseType> => {
    try {
        const findUser = await Users.findById(loggedInUserId)
            .populate({
                path: 'chatList',
                match: { _id: friendId },
                select: '_id'
            })
            .select('_id')
        if (!findUser) {
            return {
                statusCode: 404,
                message: 'User not found.'
            }
        }

        if (findUser.chatList && findUser.chatList.length === 0) {
            await Users.findByIdAndUpdate(loggedInUserId, {
                $push: { chatList: friendId }
            })
            return {
                statusCode: 200,
                message: 'User added to chat-list.'
            }
        } else {
            return {
                statusCode: 409,
                message: 'User already added in chat list.'
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            message: 'Found error in adding user into the chat-list.'
        }
    }
}
