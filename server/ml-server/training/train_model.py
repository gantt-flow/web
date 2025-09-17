# Script para entrenar y guardar el modelo Naive Bayes
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import argparse

from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import (accuracy_score, classification_report, confusion_matrix, 
                            precision_score, recall_score, f1_score, roc_auc_score)
from sklearn.preprocessing import LabelEncoder

# Configuración por defecto
DEFAULT_CSV_PATH = "task_classification_dataset.csv"  
MODEL_PATH = "naive_bayes_task_model.pkl"
VECTORIZER_PATH = "tfidf_vectorizer.pkl"

def load_and_preprocess_data(csv_path):
    """Carga y preprocesa los datos del dataset de tareas"""
    df = pd.read_csv(csv_path)
    
    # Verificar que las columnas esperadas existen
    expected_columns = ['Task Description', 'Category', 'Skill']
    for col in expected_columns:
        if col not in df.columns:
            raise ValueError(f"El dataset debe contener la columna '{col}'")
    
    # Combinar descripción y skill para mejorar la clasificación
    df['text'] = df['Task Description'] + ' ' + df['Skill'].fillna('')
    df['label'] = df['Category']
    
    print(f"Dataset cargado: {len(df)} ejemplos")
    print("Distribución de categorías:")
    print(df['label'].value_counts())
    
    return df

def evaluate_model(model, X_test, y_test, classes):
    """Evalúa el modelo y genera métricas detalladas"""
    # Realizar predicciones
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Calcular métricas
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    
    # Calcular AUC-ROC para cada clase (one-vs-rest)
    try:
        le = LabelEncoder()
        y_test_encoded = le.fit_transform(y_test)
        auc_roc = roc_auc_score(y_test_encoded, y_pred_proba, multi_class='ovr', average='weighted')
    except Exception as e:
        auc_roc = "No calculable: " + str(e)
    
    # Generar reporte de clasificación
    clf_report = classification_report(y_test, y_pred, zero_division=0)
    
    # Generar matriz de confusión
    cm = confusion_matrix(y_test, y_pred)
    
    # Validación cruzada
    cv_scores = cross_val_score(model, X_test, y_test, cv=5, scoring='accuracy')
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'auc_roc': auc_roc,
        'classification_report': clf_report,
        'confusion_matrix': cm,
        'cv_scores': cv_scores,
        'cv_mean': np.mean(cv_scores),
        'cv_std': np.std(cv_scores)
    }

def save_evaluation_report(evaluation_results, best_params, model_path, report_path):
    """Guarda un reporte detallado de la evaluación del modelo"""
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("EVALUACIÓN DEL MODELO DE CLASIFICACIÓN DE TAREAS (DATASET MEJORADO)\n")
        f.write("==================================================================\n\n")
        f.write(f"Fecha de evaluación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Modelo: {model_path}\n\n")
        
        f.write("MÉTRICAS PRINCIPALES:\n")
        f.write("---------------------\n")
        f.write(f"Exactitud (Accuracy): {evaluation_results['accuracy']:.4f}\n")
        f.write(f"Precisión (Precision): {evaluation_results['precision']:.4f}\n")
        f.write(f"Sensibilidad (Recall): {evaluation_results['recall']:.4f}\n")
        f.write(f"Puntuación F1 (F1-score): {evaluation_results['f1_score']:.4f}\n")
        
        if isinstance(evaluation_results['auc_roc'], str):
            f.write(f"AUC-ROC: {evaluation_results['auc_roc']}\n")
        else:
            f.write(f"AUC-ROC: {evaluation_results['auc_roc']:.4f}\n")
        
        f.write(f"Validación Cruzada (5-fold): {evaluation_results['cv_mean']:.4f} (±{evaluation_results['cv_std']:.4f})\n\n")
        
        f.write("MEJORES PARÁMETROS:\n")
        f.write("-------------------\n")
        for param, value in best_params.items():
            f.write(f"{param}: {value}\n")
        f.write("\n")
        
        f.write("REPORTE DE CLASIFICACIÓN:\n")
        f.write("-------------------------\n")
        f.write(evaluation_results['classification_report'])
        f.write("\n")
        
        f.write("PUNTUACIONES DE VALIDACIÓN CRUZADA:\n")
        f.write("-----------------------------------\n")
        for i, score in enumerate(evaluation_results['cv_scores']):
            f.write(f"Fold {i+1}: {score:.4f}\n")
    
    print(f"Reporte de evaluación guardado en: {report_path}")

def plot_confusion_matrix(cm, classes, model_path):
    """Genera y guarda una visualización de la matriz de confusión"""
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=classes, yticklabels=classes)
    plt.title('Matriz de Confusión - Dataset Mejorado')
    plt.ylabel('Etiqueta Real')
    plt.xlabel('Etiqueta Predicha')
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    
    # Guardar la imagen
    cm_path = f"confusion_matrix{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    plt.tight_layout()
    plt.savefig(cm_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Matriz de confusión guardada en: {cm_path}")
    return cm_path

def train_model(df):
    X = df['text'].astype(str)
    y = df['label'].astype(str)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(lowercase=True, ngram_range=(1,2), strip_accents='unicode',
                                 max_features=5000, stop_words='english')),
        ("clf", MultinomialNB())
    ])

    param_grid = {"clf__alpha": [0.01, 0.1, 0.5, 1.0, 2.0]}

    grid = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1, verbose=1)
    print("Entrenando modelo (GridSearchCV)...")
    grid.fit(X_train, y_train)
    best = grid.best_estimator_

    # Extraer y guardar el vectorizador por separado
    vectorizer = best.named_steps['tfidf']
    joblib.dump(vectorizer, VECTORIZER_PATH)
    print(f"Vectorizador guardado en: {VECTORIZER_PATH}")

    # Evaluación completa
    print("\nEvaluando modelo...")
    evaluation_results = evaluate_model(best, X_test, y_test, best.classes_)
    
    # Mostrar resultados principales
    print(f"\nRESULTADOS DE EVALUACIÓN:")
    print(f"Exactitud (Accuracy): {evaluation_results['accuracy']:.4f}")
    print(f"Precisión (Precision): {evaluation_results['precision']:.4f}")
    print(f"Sensibilidad (Recall): {evaluation_results['recall']:.4f}")
    print(f"Puntuación F1 (F1-score): {evaluation_results['f1_score']:.4f}")
    
    if isinstance(evaluation_results['auc_roc'], str):
        print(f"AUC-ROC: {evaluation_results['auc_roc']}")
    else:
        print(f"AUC-ROC: {evaluation_results['auc_roc']:.4f}")
    
    print(f"Validación Cruzada (5-fold): {evaluation_results['cv_mean']:.4f} (±{evaluation_results['cv_std']:.4f})")
    
    # Guardar reporte y matriz de confusión
    report_path = f"model_evaluation_report{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    save_evaluation_report(evaluation_results, grid.best_params_, MODEL_PATH, report_path)
    plot_confusion_matrix(evaluation_results['confusion_matrix'], best.classes_, MODEL_PATH)

    # Guardar modelo
    joblib.dump(best, MODEL_PATH)
    print(f"\nModelo entrenado y guardado en '{MODEL_PATH}'")
    
    # Devolver también el vectorizador para uso inmediato si es necesario
    return best, vectorizer

def main():
    parser = argparse.ArgumentParser(description='Entrenar modelo de clasificación de tareas con Naive Bayes')
    parser.add_argument('--csv', type=str, default=DEFAULT_CSV_PATH,
                       help=f'Ruta al archivo CSV (por defecto: {DEFAULT_CSV_PATH})')
    args = parser.parse_args()
    
    try:
        # Cargar y preprocesar datos
        df = load_and_preprocess_data(args.csv)
        
        # Entrenar modelo
        model, vectorizer = train_model(df)
        
        print("\nEntrenamiento completado exitosamente!")
        print(f"Modelo guardado en: {MODEL_PATH}")
        print(f"Vectorizador guardado en: {VECTORIZER_PATH}")
            
    except FileNotFoundError:
        print(f"No se encontró el CSV en '{args.csv}'. Verifica la ruta al archivo.")
    except Exception as e:
        print(f"Error durante el entrenamiento: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()