from flask import Blueprint, request, jsonify
from logger import get_logger
from config import Config

from flask_restx import Api, Resource

api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

api = Api(api_bp, title="API de Aulas", version="1.0", description="Swagger con Blueprint")
ns = api.namespace("aulas", description="Operaciones relacionadas con aulas")

logger = get_logger()

@ns.route("/")
class Root(Resource):
    def get(self):
        # llamar a la db para obtener un dato.
        return {'message': 'Hola'}

def register_routes(app):
    app.register_blueprint(api_bp)