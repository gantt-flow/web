import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateAuditLog } from '../utils/auditService.js';

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
    await generateAuditLog(req, 'CREATE', 'User', newUser._id, `Usuario creado: ${newUser.email}`);

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

export const getAllUsers = async (req, res) => {
  try {
    // Destructure query parameters from the request URL (e.g., /api/users?page=2&role=admin).
    // Set default values for pagination: page 1 and a limit of 10 items per page.
    // 'role' will be undefined if not provided in the URL.
    const { page = 1, limit = 10, role } = req.query;

    // Create a filter object for the database query.
    // This is a conditional (ternary) operator. If a 'role' was provided in the query,
    // the filter will be { role: role }. Otherwise, it's an empty object {},
    // which tells Mongoose to match all documents.
    const filter = role ? { role } : {};

    // Execute the database query using the 'User' Mongoose model.
    // 'await' pauses the function until the database returns the results.
    const users = await User
      .find(filter) // 1. Find all user documents that match the filter object.

      // 2. Select specific fields to return, excluding sensitive data like passwords.
      // This is also known as a "projection".
      .select('name email role isActive createdAt updatedAt permisions')

      // 3. Skip a number of documents for pagination.
      // Example: For page 2 with a limit of 10, it skips (2-1)*10 = 10 documents.
      .skip((page - 1) * limit)

      // 4. Limit the number of documents returned in this batch to the specified 'limit'.
      // We ensure 'limit' is a number, as query parameters are strings.
      .limit(Number(limit));

    // If the query is successful, send a 200 OK status code along with the
    // array of user objects in JSON format as the response.
    res.status(200).json(users);

  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    // Call a centralized error handling function to send a standardized
    // error response (e.g., a 500 Internal Server Error) to the client.
    handleError(res, error);
  }
};