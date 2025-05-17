SHELL := /bin/bash
PWD := $(shell pwd)


default: build

all:

deps:
	go mod tidy
	# go mod vendor  NO HACE FALTA CREO


docker-image-back:
	docker build -f ./back/Dockerfile -t "back:latest" .  # Construir imagen del back
.PHONY: docker-image-back

docker-image: docker-image-back

docker-compose-up: docker-image
	docker compose -f docker-compose-dev.yaml up -d --build  # Levantar ambos servicios
.PHONY: docker-compose-up

docker-compose-down:
	docker compose -f docker-compose-dev.yaml stop -t 1
	docker compose -f docker-compose-dev.yaml down
.PHONY: docker-compose-down

docker-compose-logs:
	docker compose -f docker-compose-dev.yaml logs -f
.PHONY: docker-compose-logs