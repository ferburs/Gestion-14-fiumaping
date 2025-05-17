# src/models.py
from flask_sqlalchemy import SQLAlchemy

DATABASE = SQLAlchemy()

class Aula(DATABASE.Model):
    __tablename__ = 'aulas'

    id = DATABASE.Column(DATABASE.Integer, primary_key=True)
    codigo = DATABASE.Column(DATABASE.String(50), unique=True, nullable=False)
    tipo_banco = DATABASE.Column(DATABASE.String(50), nullable=False)
    tipo_pizarron = DATABASE.Column(DATABASE.String(50), nullable=False)


    def __repr__(self):
        return f"<Aula {self.codigo}>"
    
def get_aula_by_codigo(aula_codigo):
    """Devuelve el aula con el ID especificado."""
    aula = DATABASE.session.query(Aula).filter_by(codigo=aula_codigo).first()
    return aula