// server/utils/auditService.js
import AuditLog from '../models/auditLog.js';
import { isValidObjectId } from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Función simplificada para generar logs de auditoría
 * @param {Object} req - Objeto de solicitud de Express
 * @param {String} action - Acción realizada (CREATE, UPDATE, DELETE)
 * @param {String} entityType - Tipo de entidad (User, Project, Task, etc.)
 * @param {String} entityId - ID de la entidad afectada
 * @param {String} details - Detalles adicionales de la acción
 */
export const generateAuditLog = async (req, action, entityType, entityId, details = '') => {
  try {
    // Validaciones básicas
    if (!req.user || !req.user.id) {
      logger.warn('No se pudo generar log de auditoría: usuario no autenticado');
      return;
    }

    if (!['CREATE', 'UPDATE', 'DELETE'].includes(action)) {
      logger.warn(`Acción no válida para auditoría: ${action}`);
      return;
    }

    if (!['User', 'Project', 'Task', 'Comment', 'Notification'].includes(entityType)) {
      logger.warn(`Tipo de entidad no válido para auditoría: ${entityType}`);
      return;
    }

    if (!isValidObjectId(entityId)) {
      logger.warn(`ID de entidad no válido para auditoría: ${entityId}`);
      return;
    }

    // Crear el log
    const auditLog = new AuditLog({
      action,
      details,
      relatedEntity: {
        type: entityType,
        id: entityId
      },
      performedBy: req.user.id,
      ipAddress: req.ip || req.connection.remoteAddress,
      device: req.headers['user-agent'] || 'Unknown',
      timestamp: new Date()
    });

    await auditLog.save();
    //impresión en consola de server para ver logs creados exitosamente
    //logger.info(`Log de auditoría creado: ${action} en ${entityType}`);

  } catch (error) {
    /*impresión en consola de server para ver logs creados sin éxito
    logger.error(`Error generando log de auditoría: ${error.message}`);
    // No lanzamos el error para no interrumpir el flujo principal*/
  }
};