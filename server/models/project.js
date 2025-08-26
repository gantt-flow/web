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
        enum: ['Sin iniciar', 'En progreso', 'Completado', 'En espera'],
        default: 'Sin iniciar'
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
}, {
    timestamps:true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;