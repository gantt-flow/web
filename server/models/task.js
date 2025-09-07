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
    /*typeTask: {
        type: String,
        required: true
    },*/
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
        enum: ['Sin iniciar', 'En progreso', 'Completada', 'En espera'],
        default: 'Sin iniciar'
    },
    priority: {
        type: String,
        enum: ['Baja', 'Media', 'Alta'],
        default: 'Baja'
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
    type: {
        type: String,
        enum: ['Tarea', 'Milestone'],
        default: 'Tarea'
    }
}, {
    timestamps:true
});

const Task = mongoose.model('Task', taskSchema);
export default Task;