import mongoose from "mongoose";
const { Schema } = mongoose;

const activityLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATED', 'UPDATE', 'DELETE', 'VIEW']
    },
    description: {
        type: String,
        required: false
    },
    relatedEntity: {
        type: {
            type: String,
            required: true,
            enum: ['Task', 'Comment', 'Notification', 'Attachment']
        },
        id: {
            type: Schema.Types.ObjectId,
            required: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;