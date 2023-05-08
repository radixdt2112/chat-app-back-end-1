import mongoose, { Schema } from 'mongoose'

export type groupInfo = {
    name: string
    description: string
    createdBy: String
    groupMembers: string[]
}
const groupSchema = new mongoose.Schema<groupInfo>(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        groupMembers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
                required: true
            }
        ]
    },
    { timestamps: true }
)

const groupModel = mongoose.model('group', groupSchema)
export { groupModel }
