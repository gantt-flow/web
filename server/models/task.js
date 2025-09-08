import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
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
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
    attachments: [{
        type: Schema.Types.ObjectId,
        ref: 'Attachment',
        required: false
    }],
    tags: [{
        type: String,
        required: false
    }],
    type: {
        type: String,
        enum: ['Tarea', 'Milestone'],
        default: 'Tarea',
        required: false
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
export default Task;