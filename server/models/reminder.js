import  mongoose from 'mongoose';
const { Schema } = mongoose;

const reminderSchema = new Schema({
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedEntity: {
        type: {
            type: String,
            required: true,
            enum: ['Task', 'Project', 'Comment', 'Notification']
        },
        id: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    remindAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isSent: {
        type: Boolean,
        default: false
    }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;