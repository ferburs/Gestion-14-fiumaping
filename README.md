# FuiMapping

![logo](./front/images/logo.png)

# Ejecutar backend

## Linux
Para levantar la api

```bash
make docker-compose-up
```

Y luego para pararlo

```bash
make docker-compose-down
```

Luego en tu navegador abri http://localhost:5000/api/v1

## Windows
Para levantar la api

```bash
docker build -f ./back/Dockerfile -t "back:latest" .
docker run -p 5000:5000 back:latest
```

Luego en tu navegador abri http://localhost:5000/api/v1