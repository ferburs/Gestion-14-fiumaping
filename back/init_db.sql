

CREATE TABLE IF NOT EXISTS aulas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(50) NOT NULL,
    posicion_x FLOAT NULL,
    posicion_y FLOAT NULL
);

CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS aula_materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_aula VARCHAR(50) NOT NULL,
    codigo_materia VARCHAR(50) NOT NULL,
    dia_semana VARCHAR(50) NOT NULL, -- Lunes, Martes, Miercoles, Jueves, Viernes, Sabados y Domingos
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL
);

INSERT INTO aulas
(codigo, posicion_x, posicion_y)
VALUES
('200', NULL, NULL),
('201', NULL, NULL),
('202', NULL, NULL),
('203', NULL, NULL),
('403', NULL, NULL);
--('204', NULL, NULL),
--('205', NULL, NULL),
--('206', NULL, NULL),
--('207', NULL, NULL),
--('208', NULL, NULL),
--('209', NULL, NULL),
--('210', NULL, NULL);

INSERT INTO materias
(codigo, nombre)
VALUES
('60.09', 'Analisis Numerico'),
('60.19', 'Sistemas Operativos'),
('60.20', 'Tecnicas de Diseño'),
('95.24', 'Gestión del desarrollo de sistemas informaticos');

INSERT INTO aula_materias
(codigo_aula, codigo_materia, dia_semana, hora_inicio, hora_fin)
VALUES
('200', '95.24', 'Martes', '19:00', '21:00'),
('203', '95.24', 'Jueves', '19:00', '21:00'),
('201', '60.09', 'Lunes', '15:00', '17:00'),
('201', '60.09', 'Lunes', '17:00', '19:00'),
('202', '60.19', 'Miércoles', '17:00', '19:00'),
('203', '60.19', 'Miércoles', '17:00', '19:00'),
('200', '60.20', 'Lunes', '17:00', '19:00'),
('203', '60.20', 'Martes', '17:00', '19:00');


CREATE TABLE IF NOT EXISTS atributos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_aula VARCHAR(50) NOT NULL,
    nombre_atributo VARCHAR(50) NOT NULL,
    valor TEXT NOT NULL,
    FOREIGN KEY (codigo_aula) REFERENCES aulas(codigo)
);


-- Atributos
INSERT INTO atributos (codigo_aula, nombre_atributo, valor) VALUES
('200', 'Tipo Pizarron', 'Tiza'),
('200', 'Tipo banco', 'individual'),
('200', 'Ventilacion', 'ventilador'),
('200', 'Cantidad enchufes', '2'),

('201', 'Tipo Pizarron', 'Tiza'),
('201', 'Tipo banco', 'Iglesia'),
('201', 'Ventilacion', 'aire acondicionado'),
('201', 'Cantidad enchufes', '1'),

('202', 'Tipo Pizarron', 'Marcador'),
('202', 'Tipo banco', 'Individual'),
('202', 'Ventilacion', 'Ventanas'),
('202', 'Cantidad enchufes', '0'),

('403', 'Tipo Pizarron', 'Tiza'),
('403', 'Tipo banco', 'Iglesia'),
('403', 'Ventilacion', 'Ventanas'),
('403', 'Cantidad enchufes', '2');
