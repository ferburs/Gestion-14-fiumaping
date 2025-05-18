import os
import logging
from logging.handlers import RotatingFileHandler

# Crear carpeta de logs si no existe
LOG_DIR = "logs"
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Configuración del archivo de logs
log_file = os.path.join(LOG_DIR, "app.log")
handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=5)  # Máx. 5MB por archivo, 5 backups
handler.setLevel(logging.INFO)

formatter = logging.Formatter(
    "[%(asctime)s] [%(levelname)s] - %(message)s"
)
handler.setFormatter(formatter)

# Configurar el logger principal
logger = logging.getLogger("flask_app")
logger.setLevel(logging.INFO)
logger.addHandler(handler)

# Función para obtener el logger
def get_logger():
    return logger