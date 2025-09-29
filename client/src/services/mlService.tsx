import api from '@/services/api';

export interface PredictionResult {
  prediction: string;
  confidence: number;
  top_predictions: Array<{
    label: string;
    probability: number;
  }>;
}

export interface PredictionError {
  message: string;
  status?: number;
}

class PredictionService {
  /**
   * Obtener predicción para un texto
   * @param text - Texto a clasificar
   * @returns Resultado de la predicción
   */
  async getPrediction(text: string): Promise<PredictionResult> {
    try {
      const response = await api.post<{ success: boolean; data: PredictionResult }>('/api/ml/predict', { text });
      
      // Verificar la estructura de la respuesta
      console.log('Respuesta completa del servidor:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw {
          message: 'La respuesta del servidor no tiene la estructura esperada'
        } as PredictionError;
      }
    } catch (error: any) {
      console.error('Error getting prediction:', error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        throw {
          message: error.response.data?.error || 'Error al obtener la predicción',
          status: error.response.status
        } as PredictionError;
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        throw {
          message: 'No se pudo conectar con el servidor de predicciones'
        } as PredictionError;
      } else {
        // Error al configurar la solicitud
        throw {
          message: error.message || 'Error desconocido al obtener la predicción'
        } as PredictionError;
      }
    }
  }

  /**
   * Verificar estado del servidor de predicciones
   * @returns True si el servidor está saludable
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get<{ success: boolean; data: { status: string } }>('/api/ml/health');
      return response.data.success && response.data.data.status === 'healthy';
    } catch (error) {
      console.error('Error checking health:', error);
      return false;
    }
  }
}

export const predictionService = new PredictionService();