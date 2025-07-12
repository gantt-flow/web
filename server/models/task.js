import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
        default: 'not_started'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    dependencies: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    estimatedHours: {
        type: Number,
        required: true
    },
    actualHours: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        commentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            required: true
        },
    }],
    attachments: [{
        fileId: {
            type: Schema.Types.ObjectId,
            ref: 'Attachment',
            required: true
        }
    }],
    tags: [{
        type: String,
        required: false
    }],
});

const Task = mongoose.model('Task', taskSchema);
export default Task;