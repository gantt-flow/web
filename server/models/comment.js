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
    }
}, {
    timestamps:true
});

const Comment = mongoose.model('Comment', commentsSchema);
export default Comment;