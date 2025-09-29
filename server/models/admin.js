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
        default: false 
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
    },
    globalAccess: {
        type: Boolean,
        default: false 
    },
    isActive: {
        type: Boolean,
        default: true 
    }
});


const Admin = mongoose.model('Admin', adminSchema);
export default Admin;