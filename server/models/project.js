import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
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
    teamMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    projectManager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;