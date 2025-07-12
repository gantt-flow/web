import mongoose from "mongoose";
const { Schema } = mongoose;

const commentsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    relatedEntity : {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentsSchema);
export default Comment;