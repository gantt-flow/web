import AuditLog from '../models/auditLog.js';
import { logger } from '../utils/logger.js';

export const getAuditLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      entityType, 
      startDate, 
      endDate,
      userId,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filter = {};
    if (action) filter.action = action;
    if (entityType) filter['relatedEntity.type'] = entityType;
    if (userId) filter['performedBy'] = userId;

    // Filtro por fecha
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Validar y parsear parámetros de paginación
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 100);
    const skip = (pageNum - 1) * limitNum;

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Obtener logs con paginación
    const auditLogs = await AuditLog.find(filter)
      .populate('performedBy', 'name email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Contar total de documentos
    const total = await AuditLog.countDocuments(filter);

    res.status(200).json({
      logs: auditLogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        action,
        entityType,
        startDate,
        endDate,
        userId
      }
    });
  } catch (error) {
    logger.error(`Error obteniendo logs de auditoría: ${error.message}`);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};
