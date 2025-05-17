import os
from dotenv import load_dotenv

load_dotenv()  # Carga las variables de entorno desde el archivo .env si existe

class Config:
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    DEBUG = None
    ALLOWED_ORIGINS = []

    @staticmethod
    def init():
        allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
        Config.ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(',')]