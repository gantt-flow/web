# web/server/ml-server/model/predict_task.py
import joblib
import numpy as np
import re
import sys
import json
import os

# Obtener la ruta absoluta al directorio del script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Construir la ruta absoluta al modelo
MODEL_PATH = os.path.join(script_dir, "naive_bayes_task_model.pkl")

def load_model():
    """Carga el modelo desde el archivo guardado"""
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Modelo cargado desde: {MODEL_PATH}", file=sys.stderr)
        return model
    except FileNotFoundError as e:
        print(f"Error: No se encontró el archivo del modelo. {e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error inesperado al cargar el modelo: {e}", file=sys.stderr)
        return None

def preprocess_text(text):
    """Preprocesa el texto de manera similar a como se hizo durante el entrenamiento"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text

def predict_task_type(model, description, skill=""):
    """Predice el tipo de tarea para una nueva descripción"""
    if model is None:
        raise ValueError("Modelo no cargado")
    
    text = str(description) + ' ' + str(skill)
    text = preprocess_text(text)
    
    if len(text.strip()) == 0:
        return "No classification", 0.0, []
    
    try:
        pred = model.predict([text])[0]
        probs = model.predict_proba([text])[0]
        classes = model.classes_
        
        pred_idx = list(classes).index(pred)
        pred_prob = probs[pred_idx]
        
        top_idx = np.argsort(probs)[::-1][:3]
        top_predictions = [(classes[i], float(probs[i])) for i in top_idx]
        
        return pred, pred_prob, top_predictions
    except Exception as e:
        raise Exception(f"Error durante la predicción: {str(e)}")

# Este bloque solo se ejecuta si el script se ejecuta directamente
if __name__ == "__main__":
    # Cargar el modelo una vez al iniciar el script
    model = load_model()
    if model is None:
        sys.exit(1)
    
    # Leer el texto de los argumentos de línea de comandos
    if len(sys.argv) < 2:
        print("Uso: python predict_task.py <texto>")
        sys.exit(1)
    
    text = sys.argv[1]
    
    # Realizar la predicción
    try:
        pred, pred_prob, top_predictions = predict_task_type(model, text)
        
        # Formatear la salida como JSON
        output = {
            "prediction": pred,
            "confidence": pred_prob,
            "top_predictions": [{"label": label, "probability": prob} for label, prob in top_predictions]
        }
        
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
