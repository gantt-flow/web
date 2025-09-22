// web/server/routes/mlRoutes.js
import express from 'express';
import MLController from '../controllers/mlController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Ruta para obtener predicción de un texto
 */
router.post('/predict', auth, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'El campo "text" es requerido y debe ser una cadena de texto'
            });
        }

        const prediction = await MLController.getPrediction(text);
        res.json({
            success: true,
            data: prediction
        });
    } catch (error) {
        console.error('Error en ruta /predict:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Ruta para verificar el estado del servicio de ML
 */
router.get('/health', auth, async (req, res) => {
    try {
        const isHealthy = await MLController.checkHealth();
        res.json({
            success: true,
            data: {
                status: isHealthy ? 'healthy' : 'unhealthy',
                message: isHealthy ? 'Servicio ML funcionando correctamente' : 'Servicio ML no disponible'
            }
        });
    } catch (error) {
        console.error('Error en ruta /health:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;