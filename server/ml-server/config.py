# web/server/ml-server/config.py
import os

class Config:
    """Configuración base de la aplicación"""
    DEBUG = False
    TESTING = False
    HOST = '127.0.0.1'
    PORT = 5001

class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True

class ProductionConfig(Config):
    """Configuración para producción"""
    pass

# Configuración por defecto
config = DevelopmentConfig