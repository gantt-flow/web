// web/server/controllers/mlController.js
import fetch from 'node-fetch';

const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL;

export class MLController {
    /**
     * Obtener predicción para un texto
     * @param {string} text - Texto a clasificar
     * @returns {Promise<Object>} Resultado de la predicción
     */
    static async getPrediction(text) {
        // Log de inicio de la solicitud
        //console.log(`[MLController] Iniciando solicitud de predicción para texto: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
        //console.log(`[MLController] Enviando solicitud a: ${FLASK_SERVER_URL}/api/predict`);
        
        try {
            const startTime = Date.now();
            
            const response = await fetch(`${FLASK_SERVER_URL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
                timeout: 10000, // 10 segundos de timeout
            });

            const endTime = Date.now();
            const duration = endTime - startTime;
            
            //console.log(`[MLController] Respuesta recibida en ${duration}ms. Status: ${response.status}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[MLController] Error en servidor Flask: ${response.status} ${response.statusText}. Detalles: ${errorText}`);
                throw new Error(`Error en servidor Flask: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            //console.log(`[MLController] Predicción exitosa. Resultado: ${JSON.stringify(result)}`);
            
            return result;
        } catch (error) {
            console.error('[MLController] Error al obtener predicción:', error.message);
            
            // Verificar si es un error de conexión
            if (error.code === 'ECONNREFUSED') {
                const errorMsg = 'No se puede conectar con el servidor de modelos. Asegúrate de que el servidor Flask esté ejecutándose.';
                console.error(`[MLController] ${errorMsg}`);
                throw new Error(errorMsg);
            }
            
            throw new Error(`No se pudo obtener la predicción: ${error.message}`);
        }
    }

    /**
     * Verificar estado del servidor Flask
     * @returns {Promise<boolean>} True si el servidor está saludable
     */
    static async checkHealth() {
        console.log('[MLController] Verificando estado del servidor Flask...');
        
        try {
            const response = await fetch(`${FLASK_SERVER_URL}/api/health`, {
                timeout: 3000,
            });

            if (!response.ok) {
                console.log('[MLController] Servidor Flask no responde correctamente');
                return false;
            }

            const data = await response.json();
            const isHealthy = data.status === 'healthy';
            
            console.log(`[MLController] Estado del servidor Flask: ${isHealthy ? 'healthy' : 'unhealthy'}`);
            
            return isHealthy;
        } catch (error) {
            console.error('[MLController] Error al verificar salud del servidor Flask:', error.message);
            return false;
        }
    }
}

export default MLController;


