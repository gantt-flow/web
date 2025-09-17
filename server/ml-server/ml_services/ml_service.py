# web/server/ml-server/ml_services/ml_service.py
import sys
import os

# Agregar la carpeta model al path para poder importar predict_task
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(current_dir, '..', 'model')
sys.path.append(model_dir)

from predict_task import load_model, predict_task_type

class MLService:
    """Servicio para manejar operaciones de machine learning"""
    
    _instance = None
    model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLService, cls).__new__(cls)
            cls._instance.init_model()
        return cls._instance
    
    def init_model(self):
        """Inicializar el modelo de machine learning"""
        try:
            self.model = load_model()
            print("Modelo cargado exitosamente")
            return True
        except Exception as e:
            print(f"Error al cargar el modelo: {str(e)}")
            self.model = None
            return False
    
    def get_prediction(self, text):
        """Obtener predicción para un texto dado"""
        if self.model is None:
            if not self.init_model():
                raise Exception("Modelo no disponible")
        
        try:
            pred, pred_prob, top_predictions = predict_task_type(self.model, text)
            
            return {
                "prediction": pred,
                "confidence": float(pred_prob),
                "top_predictions": [{"label": label, "probability": float(prob)} for label, prob in top_predictions]
            }
        except Exception as e:
            raise Exception(f"Error durante la predicción: {str(e)}")
    
    def health_check(self):
        """Verificar el estado del servicio"""
        return {
            "status": "healthy" if self.model is not None else "unhealthy",
            "message": "Servicio ML funcionando correctamente" if self.model is not None else "Error: Modelo no cargado"
        }

# Instancia global del servicio
ml_service = MLService()