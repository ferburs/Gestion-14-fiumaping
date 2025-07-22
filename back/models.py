# src/models.py
from flask_sqlalchemy import SQLAlchemy
import logging
import time
import datetime as dt

DATABASE = SQLAlchemy()

class Aula(DATABASE.Model):
    __tablename__ = 'aulas'

    id = DATABASE.Column(DATABASE.Integer, primary_key=True)
    codigo = DATABASE.Column(DATABASE.String(50), unique=True, nullable=False)
    posicion_x = DATABASE.Column(DATABASE.Float, nullable=True)
    posicion_y = DATABASE.Column(DATABASE.Float, nullable=True)



    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "posicion_x": self.posicion_x,
            "posicion_y": self.posicion_y
            #"atributos": [atributo.to_dict() for atributo in self.atributos]
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

def aula_post_new_atribute(codigo_aula: str, nombre_atributo: str, valor: str):
    """Agrega un nuevo atributo a un aula."""
    aula = aula_get_by_codigo(codigo_aula)
    
    if aula is None:
        raise ValueError("Aula no encontrada")

    nuevo_atributo = Atributos(
        codigo_aula=codigo_aula,
        nombre_atributo=nombre_atributo,
        valor=valor
    )
    
    DATABASE.session.add(nuevo_atributo)
    DATABASE.session.commit()
    
    return nuevo_atributo.id

def aula_put_update_atribute(codigo_aula: str, nombre_atributo: str, valor: str, id_atributo: int = None):
    """Actualiza un atributo de un aula."""
    aula = aula_get_by_codigo(codigo_aula)
    
    if aula is None:
        raise ValueError("Aula no encontrada")

    atributo = DATABASE.session.query(Atributos).filter_by(id=id_atributo).first()
    
    if atributo is None:
        raise ValueError("Atributo no encontrado")

    atributo.valor = valor
    DATABASE.session.commit()

def aula_delete_atribute(codigo_aula: str, id_atributo: int = None):
    """Elimina un atributo de un aula."""
    aula = aula_get_by_codigo(codigo_aula)

    if aula is None:
        raise ValueError("Aula no encontrada")

    DATABASE.session.query(Atributos).filter_by(id=id_atributo).delete()
    DATABASE.session.commit()



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

def materias_por_aula_get(codigo_aula: str) -> list[Materia]:

    """Devuelve todas las materias que se dictan en un aula, con sus horarios"""

    resultados = (
        DATABASE.session.query(AulaMateria, Materia)
        .join(Materia, AulaMateria.codigo_materia == Materia.codigo)
        .filter(AulaMateria.codigo_aula == codigo_aula)
        .all()
    )

    return [
        {
            "codigo_materia": aula_materia.codigo_materia,
            "nombre_materia": materia.nombre,
            "dia_semana": aula_materia.dia_semana,
            "hora_inicio": aula_materia.hora_inicio.strftime('%H:%M'),
            "hora_fin": aula_materia.hora_fin.strftime('%H:%M')
        }
        for aula_materia, materia in resultados
    ]

    
    #return DATABASE.session.query(AulaMateria).filter_by(codigo_aula=codigo_aula).all()

def materias_por_aula_post(codigo_aula: str, codigo_materia: str, dia_semana: str, hora_inicio: str, hora_fin: str) -> list[Materia]:
    """Agrega el horario de una materia en un aula"""
    aula = aula_get_by_codigo(codigo_aula)

    if aula is None:
        raise ValueError("Aula no encontrada")

    materia = materia_get_by_codigo(codigo_materia)

    if materia is None:
        raise ValueError("Materia no encontrada")

    time_inicio=time.strptime(hora_inicio, '%H:%M')
    time_fin=time.strptime(hora_fin, '%H:%M')

    nuevo_horario = AulaMateria(
        codigo_aula=codigo_aula,
        codigo_materia=codigo_materia,
        dia_semana=dia_semana,
        hora_inicio=dt.time(time_inicio.tm_hour, time_inicio.tm_min),
        hora_fin=dt.time(time_fin.tm_hour, time_fin.tm_min),
    )

    DATABASE.session.add(nuevo_horario)
    DATABASE.session.commit()

    return nuevo_horario.id

def materias_por_aula_delete(**filters):
    """Elimina filas de la tabla 'aula_materias' segun los filtros indicados"""

    DATABASE.session.query(AulaMateria).filter_by(**filters).delete()
    DATABASE.session.commit()


def materia_get_all() -> list[Materia]:
    """Devuelve todas las materias."""
    return DATABASE.session.query(Materia).all()

def materia_get_by_codigo(codigo) -> Aula:
    """Devuelve la materia con el codigo especificado."""
    return DATABASE.session.query(Materia).filter_by(codigo=codigo).first()


class AulaMateria(DATABASE.Model):
    __tablename__ = 'aula_materias'

    id = DATABASE.Column(DATABASE.Integer, primary_key=True)
    codigo_aula = DATABASE.Column(DATABASE.String(50), DATABASE.ForeignKey('aulas.codigo'))
    codigo_materia = DATABASE.Column(DATABASE.String(50), DATABASE.ForeignKey('materias.codigo'))
    dia_semana = DATABASE.Column(DATABASE.String(50), nullable=False)
    hora_inicio = DATABASE.Column(DATABASE.Time, nullable=False)
    hora_fin = DATABASE.Column(DATABASE.Time, nullable=False)

    def to_dict(self):
        return {
            "codigo_aula": self.codigo_aula,
            "codigo_materia": self.codigo_materia,
            "dia_semana": self.dia_semana,
            "hora_inicio": self.hora_inicio.strftime("%H:%M"),
            "hora_fin": self.hora_fin.strftime("%H:%M"),
        }
    
def aulas_por_materia_get(codigo_materia: str) -> list[dict]:
    """Devuelve todas las aulas donde se dicta la materia, con horarios."""
    return ( 
        DATABASE.session.query(AulaMateria, Aula, Materia)
                .join(Aula, AulaMateria.codigo_aula == Aula.codigo)
                .join(Materia, AulaMateria.codigo_materia == Materia.codigo)
                .filter(AulaMateria.codigo_materia == codigo_materia)
                .all()
    )


class Atributos(DATABASE.Model):
    __tablename__ = 'atributos'


    id = DATABASE.Column(DATABASE.Integer, primary_key=True)
    codigo_aula = DATABASE.Column(DATABASE.String(50), DATABASE.ForeignKey('aulas.codigo'))
    nombre_atributo = DATABASE.Column(DATABASE.String(50), nullable=False)
    valor = DATABASE.Column(DATABASE.Text, nullable=False)


    def __repr__(self):
        return f"<Atributo {self.nombre_atributo}={self.valor} (Aula {self.codigo_aula})>"


    def to_dict(self):
        return {
            "id": self.id,
            "codigo_aula": self.codigo_aula,
            "nombre_atributo": self.nombre_atributo,
            "valor": self.valor
        }
    
def get_atributos(codigo_aula: str) -> list[Atributos]:
    """Devuelve todos los atributos de un aula."""
    return DATABASE.session.query(Atributos).filter_by(codigo_aula=codigo_aula).all()
