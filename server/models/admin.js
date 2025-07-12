import mongoose from 'mongoose';
const { Schema } = mongoose;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
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
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system' // Tema por defecto
    },
    globalAccess: {
        type: Boolean,
        default: false // Indica si el administrador tiene acceso global a todas las funciones
    },
    isActive: {
        type: Boolean,
        default: true // Indica si el administrador está activo
    }
});


const Admin = mongoose.model('Admin', adminSchema);
export default Admin;