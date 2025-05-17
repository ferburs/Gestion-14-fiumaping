from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from logger import get_logger
from routes import register_routes
from models import DATABASE, Aula
from sqlalchemy import text
import signal
import sys
import logging
import sqlite3


# --- Inicializacion de la api ---
app = Flask(__name__)

Config.init()
CORS(app, resources={r"/api/*": {"origins": Config.ALLOWED_ORIGINS}})
app.config.from_object(Config)
logger = get_logger()

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
DATABASE.init_app(app)


# --- Configuración de Logging ---
logging.basicConfig(
    level=logging.INFO,
    handlers=[
        logging.FileHandler("app.log", encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
    format='%(asctime)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s'
)

# --- Middlewares ---
@app.before_request
def log_request_info():
    """Registra la información de cada solicitud entrante."""
    logger.info(f"Request: {request.method} {request.url} - Body: {request.get_json(silent=True)}")

@app.after_request
def log_response_info(response):
    """Registra la información de cada respuesta saliente."""
    logger.info(f"Response: {response.status_code} - {response.get_json(silent=True)}")
    return response

@app.errorhandler(Exception)
def handle_exception(e):
    """Maneja las excepciones no controladas y devuelve una respuesta de error interna."""
    logger.exception(f"Error inesperado en {request.method} {request.url}: {e}")
    return jsonify({"error": "Internal Server Error"}), 500

# --- Manejo de Señales del Sistema ---
def signal_handler(sig, frame):
    """Maneja las señales de terminación (SIGTERM, SIGINT) para un cierre limpio."""
    logger.warning(f"Received termination signal: {sig}. Shutting down...")
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

# --- Registrar las rutas de la API ---
register_routes(app)


if __name__ == "__main__":
    with app.app_context():
        conn = DATABASE.engine.raw_connection()
        try:
            cursor = conn.cursor()
            cursor.executescript(open('init_db.sql').read())
            conn.commit()
        finally:
            conn.close()

    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)