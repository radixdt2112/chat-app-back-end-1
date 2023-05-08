import mongoose, { Schema } from 'mongoose'
import { chatInfo } from './privateChat'

export type groupChat = chatInfo & {
    group: String
}
const groupChatSchema = new mongoose.Schema<groupChat>(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'group',
            required: true
        },
        message: {
            type: String,
            trim: true,
            required: true
        }
    },
    { timestamps: true }
)
const GroupChatModel = mongoose.model('groupChat', groupChatSchema)
export { GroupChatModel }
