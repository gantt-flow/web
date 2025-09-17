# web/server/ml-server/ml_api/routes.py
from flask import Blueprint
from .controllers import health_check, predict, predict_batch

# Crear un blueprint para la API
api_bp = Blueprint('api', __name__)

# Definir las rutas
api_bp.route('/health', methods=['GET'])(health_check)
api_bp.route('/predict', methods=['POST'])(predict)
api_bp.route('/predict/batch', methods=['POST'])(predict_batch)