from flask import Blueprint, jsonify
from logger import get_logger
from config import Config
from models import *

from flask_restx import Api, Resource

api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

api = Api(api_bp, title="API de Aulas", version="1.0", description="Swagger con Blueprint")
ns_aulas = api.namespace("aulas", description="Operaciones relacionadas con aulas")
ns_materias = api.namespace("materias", description="Operaciones relacionadas con las materias")

logger = get_logger()

@ns_aulas.route("/")
class AulaGetTodas(Resource):
    def get(self):
        """
        Devuelve todas las aulas
        """
        aulas = aula_get_all()

        return jsonify([aula.to_dict() for aula in aulas])

@ns_aulas.route("/<string:codigo_aula>")
class AulaGetPorCodigoResource(Resource):
    def get(self, codigo_aula: str):
        """
        Devuelve la información del aula con el número especificado.
        """
        
        aula = aula_get_by_codigo(codigo_aula)

        if aula is None:
            return {"error": "Aula no encontrada"}, 404
        
        return jsonify(aula.to_dict()), 200
    
@ns_aulas.route("/<string:codigo_aula>/atributos")
class AulaAtributosGetPorCodigo(Resource):
    def get(self, codigo_aula: str):
        """
        Devuelve los atributos del aula con el número especificado.
        """
        
        aula = aula_get_by_codigo(codigo_aula)

        if aula is None:
            return {"error": "Aula no encontrada"}, 404
        
        print(f"\n Codigo aula: {codigo_aula}\n")


        atributos = get_atributos(codigo_aula)

        print(f"\n Atributos: {atributos}\n")

        if atributos is None:
            return {"error": "Atributos no encontrados"}, 404
        
        return jsonify([a.to_dict() for a in atributos])

@ns_materias.route("/")
class MateriasGetTodas(Resource):
    def get(self):
        """
        Devuelve todas las materias
        """

        materias = materia_get_all()

        return jsonify([materia.to_dict() for materia in materias])

@ns_materias.route("/<string:codigo_materia>")
class MateriaHorariosGetPorCodigo(Resource):
    def get(self, codigo_materia: str):
        """
        Devuelve todos los horarios de la materia
        """

        aulas_materia = aulas_por_materia_get(codigo_materia)

        return [
            {
                "aula": aula.to_dict(),
                "materia": materia.to_dict(),
                "dia_semana": aula_materia.dia_semana,
                "hora_inicio": aula_materia.hora_inicio.strftime("%H:%M"),
                "hora_fin": aula_materia.hora_fin.strftime("%H:%M"),
            }
            for aula_materia, aula, materia in aulas_materia
        ]



@ns_materias.route("/<string:codigo_aula>/materias")
class MateriaPorAula(Resource):
    def get(self, codigo_aula: str):
        """
        Devuelve todas las materias que se dictan en el aula
        """

        return materias_por_aula_get(codigo_aula)

    

def register_routes(app):
    app.register_blueprint(api_bp)