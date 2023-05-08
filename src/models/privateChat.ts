import mongoose, { ObjectId, Schema } from 'mongoose'

export type chatInfo = {
    from: ObjectId
    to: ObjectId
    message: string
    privateChatId: string
    unread: boolean
}
const privateChatSchema = new mongoose.Schema<chatInfo>(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        message: {
            type: String,
            trim: true,
            required: true
        },
        privateChatId: {
            type: String,
            trim: true,
            required: true
        },
        unread: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)
// privateChatSchema.index({ from: 1, to: 1 }, { unique: true })
const PrivateChatModel = mongoose.model('private_chat', privateChatSchema)
export { PrivateChatModel }
