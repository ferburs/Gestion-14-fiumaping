import os
from dotenv import load_dotenv

load_dotenv()  # Carga las variables de entorno desde el archivo .env si existe

class Config:
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    DEBUG = None
    ALLOWED_ORIGINS = []
    GOOGLE_CLIENT_ID = None
    GOOGLE_CLIENT_SECRET = None
    JWT_SECRET = None
    SECRET_KEY = None
    FRONTEND_GOOGLE_LOGIN_URL = None
    IS_PRODUCTION = False

    @staticmethod
    def init():
        allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
        Config.ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(',')]
        Config.GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
        Config.GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
        Config.JWT_SECRET = os.environ.get("JWT_SECRET", "")
        Config.SECRET_KEY = os.environ.get("SECRET_KEY", "")
        Config.FRONTEND_GOOGLE_LOGIN_URL = os.environ.get("FRONTEND_GOOGLE_LOGIN_URL", "")
        Config.IS_PRODUCTION = (os.environ.get("IS_PRODUCTION", "True") == "True")