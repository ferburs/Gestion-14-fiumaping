from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from logger import get_logger
from routes import register_routes
#from models import db, Aula
import signal
import sys
import logging


# --- Inicializacion de la api ---
app = Flask(__name__)


Config.init()
CORS(app, resources={r"/api/*": {"origins": Config.ALLOWED_ORIGINS}})
app.config.from_object(Config)
logger = get_logger()

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

# def preload_db():
#     """Pre-carga la base de datos con datos iniciales."""
#     # Aquí puedes agregar la lógica para precargar la base de datos.
#     if Aula.query.first() is None:
#         aulas = [
#             Aula(codigo='101', tipo_banco='individual', tipo_pizarron='Tiza'),
#             Aula(codigo='102', tipo_banco='Iglesia', tipo_pizarron='Marcador'),
#         ]
#         db.session.add_all(aulas)
#         db.session.commit()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)