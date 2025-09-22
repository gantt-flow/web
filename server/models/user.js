import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Administrador de sistema','Administrador de proyectos','Miembro de equipo','Colaborador', 'Cliente','Auditor'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true // Indica si el usuario está activo
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png' // Ruta por defecto para la imagen de perfil
    },
    lastLogin: {
        type: Date,
        default: null // Fecha del último inicio de sesión, puede ser nula si nunca ha iniciado sesión
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false // Indica si la autenticación de dos factores está habilitada
    },
    notifications: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system' // Tema por defecto
    },
    readOnly: {
        type: Boolean,
        default: false // Indica si el usuario tiene acceso de solo lectura
    },
    auditLogAccess: {
        type: Boolean,
        default: false // Indica si el usuario tiene acceso a los registros de auditoría
    },
    projectId: [{
        type: Schema.Types.ObjectId,
        ref: 'Project' // Referencia a la colección de proyectos
    }],
    taskId: [{
        type: Schema.Types.ObjectId,
        ref: 'Task' // Referencia a la colección de tareas
    }],
    permisions: {
        type: Map,
        of: Boolean,
        default: {
            canCreateProject: false,
            canEditProject: false,
            canDeleteProject: false,
            canViewProject: true,
            canCreateTask: false,
            canEditTask: false,
            canDeleteTask: false,
            canViewTask: true
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps:true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;


