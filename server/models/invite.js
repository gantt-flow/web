import mongoose from "mongoose";
const { Schema } = mongoose;

const InviteSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    role: {
        type: String,
        enum: ['Administrador de proyectos','Miembro de equipo','Colaborador', 'Cliente'],
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps:true
});

// Índice compuesto para evitar invitaciones duplicadas al mismo proyecto
InviteSchema.index({ email: 1, projectId: 1 }, { unique: true });

const Invite = mongoose.model('Invite', InviteSchema);
export default Invite;