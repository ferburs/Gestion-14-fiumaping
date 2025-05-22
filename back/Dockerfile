FROM python:3.10-slim

WORKDIR .

# Copiar archivos del proyecto
COPY back /

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto Flask (usualmente 5000)
EXPOSE 5000

# Comando para correr la app
CMD ["python", "app.py"]