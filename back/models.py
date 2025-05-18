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

    #atributos = DATABASE.relationship('Atributo', back_populates='aula', lazy=True, cascade="all, delete-orphan")


    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "tipo_pizarron": self.tipo_pizarron,
            "tipo_banco": self.tipo_banco,
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


class atributos(DATABASE.model):
    __tablename__ = 'atributos'


    id = DATABASE.Column(DATABASE.Integer, primary_key=True)
    codigo_aula = DATABASE.Column(DATABASE.String(50), DATABASE.ForeignKey('aulas.codigo'))
    nombre_atributo = DATABASE.Column(DATABASE.String(50), nullable=False)
    valor = DATABASE.Column(DATABASE.Text, nullable=False)

    aula = DATABASE.relationship('Aula', back_populates='atributos', lazy=True)


    def __repr__(self):
        return f"<Atributo {self.nombre_atributo}={self.valor} (Aula {self.codigo_aula})>"


    def to_dict(self):
        return {
            'id': self.id,
            'codigo_aula': self.codigo_aula,
            'nombre_atributo': self.nombre_atributo,
            'valor': self.valor
        }