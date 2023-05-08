import mongoose, { Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'

export type User = {
    name: string
    email: string
    bio?: string
    image?: string
    chatList?: { _id: string; name: string }[]
}

const userSchema = new mongoose.Schema<User>(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: true
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 40
        },
        image: {
            type: String
        },
        chatList: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    { timestamps: true }
)
const Users = mongoose.model('user', userSchema)
export { Users }
