import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const createUserAdmin = async (req, res) => {
  try {
    const userData = req.body;

    // Validación de campos requeridos
    if (!userData.name || !userData.email || !userData.password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son campos requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear nuevo usuario con todos los campos
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      passwordHash: hashedPassword,
      role: userData.role || 'Miembro de equipo',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      profilePicture: userData.profilePicture || 'default-profile.png',
      notifications: userData.notifications !== undefined ? userData.notifications : true,
      theme: userData.theme || 'system',
      readOnly: userData.readOnly || false,
      auditLogAccess: userData.auditLogAccess || false,
      // Agregar otros campos según tu modelo
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    // Preparar respuesta sin información sensible
    const userResponse = { ...newUser.toObject() };
    delete userResponse.passwordHash;
    
    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user: userResponse
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    // Respuesta de error simplificada
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};