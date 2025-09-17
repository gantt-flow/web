# web/server/ml-server/ml_api/controllers.py
from flask import jsonify, request
from ml_services.ml_service import ml_service

def health_check():
    """Controlador para verificar el estado del servicio"""
    status = ml_service.health_check()
    return jsonify(status)

def predict():
    """Controlador para realizar una predicción"""
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "Se requiere campo 'text' en el cuerpo de la solicitud"}), 400
    
    text = data['text']
    
    try:
        result = ml_service.get_prediction(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500