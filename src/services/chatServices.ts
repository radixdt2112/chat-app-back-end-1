import { chatInfo, PrivateChatModel } from '../models/privateChat'
import { checkUserToInChatListOfFrom } from './userServices'

export const saveMessage = async (chatInfo: chatInfo) => {
    try {
        await checkUserToInChatListOfFrom(chatInfo.from, chatInfo.to)
        const data = new PrivateChatModel(chatInfo)
        await data.save()
    } catch (e: unknown) {
        console.log('Error when creating user:', e)
    }
}

export const changeMessageStatus = async (from: string, to: string) => {
    try {
        await PrivateChatModel.updateMany(
            { from: from, to: to },
            { $set: { unread: false } }
        )
        return true
    } catch (error) {
        console.log('error :>', error)
        return false
    }
}

export const chatHistory = async (to: string, from: string) => {
    try {
        let privateChatId: String = ''
        const result = await PrivateChatModel.findOne({
            to: to,
            from: from
        }).select('privateChatId')

        if (result) {
            privateChatId = result.privateChatId
        } else {
            const result = await PrivateChatModel.findOne({
                to: from,
                from: to
            }).select('privateChatId')
            if (result) {
                privateChatId = result.privateChatId
            }
        }

        const chatInfo = await PrivateChatModel.find({
            privateChatId: privateChatId
        })
            .select('-__v -updatedAt -unread')
            .sort({ createdAt: 1 })

        if (chatInfo && chatInfo.length > 0) {
            return chatInfo
        } else return []
    } catch (e: unknown) {
        console.log('Error when creating user:', e)
        return []
    }
}
