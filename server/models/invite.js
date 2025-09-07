import mongoose from "mongoose";
const { Schema } = mongoose;

const InviteSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps:true
});

const Invite = mongoose.model('Invite', InviteSchema);
export default Invite;