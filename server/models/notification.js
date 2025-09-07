import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationsSchema = new Schema({
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
    isRead: {
        type: Boolean,
        default: false
    },
}, {
    timestamps:true
});

const Notification = mongoose.model('Notification', notificationsSchema);
export default Notification;