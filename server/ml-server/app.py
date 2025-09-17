# web/server/ml-server/app.py
import sys
import os
from flask import Flask
from flask_cors import CORS
from config import config

# Agregar el directorio actual al path para importaciones
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml_api.routes import api_bp
from ml_services.ml_service import ml_service

def create_app():
    """Factory function para crear la aplicación Flask"""
    app = Flask(__name__)
    
    # Configuración
    app.config.from_object(config)
    
    # Habilitar CORS
    CORS(app)
    
    # Registrar blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Verificar si el modelo se cargó correctamente
    if ml_service.model is not None:
        print(f"Iniciando servidor Flask en http://{config.HOST}:{config.PORT}")
        app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
    else:
        print("No se pudo iniciar el servidor debido a error al cargar el modelo")