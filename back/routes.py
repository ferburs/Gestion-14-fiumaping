from flask import Blueprint, jsonify, url_for, redirect, request
from logger import get_logger
from config import Config
from models import *
from authlib.integrations.flask_client import OAuth
import jwt
import time

from flask_restx import Api, Resource


api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

api = Api(api_bp, title="API de Fiumapping", version="1.0", description="Swagger con Blueprint")
ns_auth = api.namespace("auth", description="Operaciones relacionadas con la auth")
ns_aulas = api.namespace("aulas", description="Operaciones relacionadas con aulas")
ns_materias = api.namespace("materias", description="Operaciones relacionadas con las materias")

logger = get_logger()

# Configuración de OAuth
oauth = OAuth()
google = None  # lo inicializamos luego en app.py

def authorization(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return {"error": "Token no provisto"}, 401

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
        return {
            "email": payload.get("email"),
            "name": payload.get("name"),
            "role": payload.get("role"),
        }, 200
    except jwt.ExpiredSignatureError:
        return {"error": "Token expirado"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token inválido"}, 401

def is_success(status):
    return 200 <= status <= 299

def require_admin(request):
    auth_response = authorization(request)
    if auth_response[0].get('role') != 'ADMIN':
        if is_success(auth_response[1]):
            return {"error": "Acceso denegado"}, 403
    return auth_response

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

    def post(self,codigo_aula: str):
        """
        Agrega una fila a la tabla atributos.
        Devuelve el id del elemento agregado a la base de datos
        //agrega uno nuevo
        """

        auth_response = require_admin(request)
        if not is_success(auth_response[1]):
            return auth_response

        #Le agrego un atributo a un aula
        id_atributo = aula_post_new_atribute(codigo_aula, request.json["nombre_atributo"], request.json["valor"])

        return {"id": id_atributo}, 201

    def put(self, codigo_aula: str):
        """
        Actualiza una fila en la tabla atributos. // modifica el actual
        """

        auth_response = require_admin(request)
        if not is_success(auth_response[1]):
            return auth_response

        #Modifico el atributo de un aula
        aula_put_update_atribute(
            codigo_aula,
            request.json["nombre_atributo"],
            request.json["valor"],
            request.json["id"]
        )


        return {}, 200

    def delete(self, codigo_aula: str):
        """
        Elimina una fila en la tabla atributos.
        """

        auth_response = require_admin(request)
        if not is_success(auth_response[1]):
            return auth_response

        #Elimino el atributo de un aula
        aula_delete_atribute(codigo_aula, request.args.get('id'))

        return {}, 200

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

    def post(self, codigo_materia: str):
        """
        Agrega el horario de una materia al cronograma de un aula
        """

        auth_response = require_admin(request)
        if not is_success(auth_response[1]):
            return auth_response

        id_aula_materia = materias_por_aula_post(
            request.json['codigo_aula'],
            codigo_materia,
            request.json['dia_semana'],
            request.json['hora_inicio'],
            request.json['hora_fin'],
        )

        return {"id": id_aula_materia}, 201

    def delete(self, codigo_materia: str):
        """
        Elimina el cronograma correspondiente a una materia
        """

        auth_response = require_admin(request)
        if not is_success(auth_response[1]):
            return auth_response

        materias_por_aula_delete(codigo_materia=codigo_materia)

        return 200

@ns_materias.route("/<string:codigo_aula>/materias")
class MateriaPorAula(Resource):
    def get(self, codigo_aula: str):
        """
        Devuelve todas las materias que se dictan en el aula
        """

        return materias_por_aula_get(codigo_aula)

    def post(self, codigo_aula: str):
        """
        Agrega el horario de una materia al cronograma de un aula
        """

        auth_response = require_admin(request)
        if not is_success(auth_response[1]):
            return auth_response

        id_aula_materia = materias_por_aula_post(
            codigo_aula,
            request.json['codigo'],
            request.json['dia_semana'],
            request.json['hora_inicio'],
            request.json['hora_fin'],
        )

        return {"id": id_aula_materia}, 201

    def delete(self, codigo_aula: str):
        """
        Elimina el cronograma correspondiente a un aula
        """

        auth_response = require_admin(request)
        if not is_success(auth_response[1]):
            return auth_response

        materias_por_aula_delete(codigo_aula=codigo_aula)

        return 200
    
@ns_auth.route('/google-login')
class GoogleLogin(Resource):
    def get(self):
        """
        Redirige al login de Google
        """
        redirect_uri = ""

        if Config.IS_PRODUCTION:
            redirect_uri = url_for('api.google_callback', _external=True, _scheme='https')
        else:
            print("No es producción, usando http")
            print("Whitelist de admins:")
            print(Config.ADMIN_EMAIL_WHITELIST)
            redirect_uri = url_for('api.google_callback', _external=True)
        
        return google.authorize_redirect(redirect_uri)
    
@ns_auth.route('/user-info')
class UserInfo(Resource):
    def get(self):
        return authorization(request)

@api_bp.route('/auth/callback')
def google_callback():
    token = google.authorize_access_token()
    userinfo_endpoint = google.server_metadata['userinfo_endpoint']
    resp = google.get(userinfo_endpoint)
    user_info = resp.json()

    # Asignamos el rol según el email
    email = user_info['email']
    role = "ADMIN" if email in Config.ADMIN_EMAIL_WHITELIST else "USER"

    payload = {
        "email": user_info['email'],
        "name": user_info['name'],
        "role": role,
        "exp": int(time.time()) + 3600
    }

    jwt_token = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")
    if isinstance(jwt_token, bytes):
        jwt_token = jwt_token.decode('utf-8')

    redirect_url = f"{Config.FRONTEND_GOOGLE_LOGIN_URL}?token={jwt_token}"

    return redirect(redirect_url)

def register_routes(app):
    app.register_blueprint(api_bp)
