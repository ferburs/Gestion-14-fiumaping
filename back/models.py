# src/models.py
from flask_sqlalchemy import SQLAlchemy

DATABASE = SQLAlchemy()

class Aula(DATABASE.Model):
    __tablename__ = 'aulas'

    id = DATABASE.Column(DATABASE.Integer, primary_key=True)
    codigo = DATABASE.Column(DATABASE.String(50), unique=True, nullable=False)
    tipo_banco = DATABASE.Column(DATABASE.String(50), nullable=False)
    tipo_pizarron = DATABASE.Column(DATABASE.String(50), nullable=False)
    posicion_x = DATABASE.Column(DATABASE.Float, nullable=True)
    posicion_y = DATABASE.Column(DATABASE.Float, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "tipo_pizarron": self.tipo_pizarron,
            "tipo_banco": self.tipo_banco,
            "posicion_x": self.posicion_x,
            "posicion_y": self.posicion_y
        }

    def __repr__(self):
        return f"<Aula {self.codigo}>"
    
def aula_get_by_codigo(aula_codigo) -> Aula:
    """Devuelve el aula con el ID especificado."""
    aula = DATABASE.session.query(Aula).filter_by(codigo=aula_codigo).first()
    return aula

def aula_get_all() -> list[Aula]:
    """Devuelve todas las aulas."""
    return DATABASE.session.query(Aula).all()


class Materia(DATABASE.Model):
    __tablename__ = 'materias'

    id = DATABASE.Column(DATABASE.Integer, primary_key=True)
    codigo = DATABASE.Column(DATABASE.String(50), unique=True, nullable=False)
    nombre = DATABASE.Column(DATABASE.String(150), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "nombre": self.nombre
        }

def materia_get_all() -> list[Materia]:
    """Devuelve todas las materias."""
    return DATABASE.session.query(Materia).all()