# # src/models.py
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

# class Aula(db.Model):
#     __tablename__ = 'aulas'

#     id = db.Column(db.Integer, primary_key=True)
#     codigo = db.Column(db.String(10), unique=True, nullable=False)
#     tipo_banco = db.Column(db.String(50), nullable=False)
#     tipo_pizarron = db.Column(db.String(50), nullable=False)

#     def __repr__(self):
#         return f"<Aula {self.codigo}>"