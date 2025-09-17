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

def predict_batch():
    """Controlador para realizar predicciones por lotes"""
    data = request.get_json()
    
    if not data or 'texts' not in data or not isinstance(data['texts'], list):
        return jsonify({"error": "Se requiere campo 'texts' con una lista de textos"}), 400
    
    try:
        results = ml_service.get_batch_predictions(data['texts'])
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500