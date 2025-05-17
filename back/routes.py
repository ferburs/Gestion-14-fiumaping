from flask import Blueprint, request, jsonify
from logger import get_logger
from config import Config
from models import *

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

@ns.route("/<string:codigo_aula>")
class AulaResource(Resource):
    def get(self, codigo_aula):
        """
        Devuelve la información del aula con el número especificado.
        """
        # Supongamos que tenés una función o modelo que busca el aula:
        aula = get_aula_by_codigo(codigo_aula)
        if aula is None:
            return {"error": "Aula no encontrada"}, 404
        # Si el aula existe, devuelve sus detalles
        aula_data = {
            "codigo": aula.codigo,
            "tipo_banco": aula.tipo_banco,
            "tipo_pizarron": aula.tipo_pizarron,
        }
        return aula_data, 200
        #return aula, 200

def register_routes(app):
    app.register_blueprint(api_bp)