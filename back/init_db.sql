-- Aula pero con atributo

-- CREATE TABLE IF NOT EXISTS aulas{
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     codigo VARCHAR(50) NOT NULL,
--     posicion_x FLOAT NULL,
--     posicion_y FLOAT NULL,
-- }

-- CREATE TABLE IF NOT EXISTS atributos (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     codigo_aula VARCHAR(50) NOT NULL,
--     nombre_atributo VARCHAR(50) NOT NULL,
--     valor TEXT NOT NULL,
--     FOREIGN KEY (codigo_aula) REFERENCES aulas(codigo)
-- );

-- INSERT INTO aulas (codigo, posicion_x, posicion_y) VALUES
-- ('200', NULL, NULL),
-- ('201', NULL, NULL),
-- ('202', NULL, NULL);

-- -- Atributos
-- INSERT INTO atributos_aula (codigo_aula, nombre_atributo, valor) VALUES
-- ('200', 'tipo_pizarron', 'Tiza'),
-- ('200', 'tipo_banco', 'individual'),
-- ('200', 'ventilacion', 'ventilador'),
-- ('200', 'Cantidad enchufes', '2'),

-- ('201', 'tipo_pizarron', 'Tiza'),
-- ('201', 'tipo_banco', 'Iglesia'),
-- ('201', 'ventilacion', 'aire acondicionado'),

-- ('202', 'tipo_pizarron', 'Marcador'),
-- ('202', 'tipo_banco', 'individual'),
-- ('202', 'ventilacion', 'Ventanas');




CREATE TABLE IF NOT EXISTS aulas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(50) NOT NULL,
    tipo_pizarron VARCHAR(50) NOT NULL,
    tipo_banco VARCHAR(50) NOT NULL,
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
(codigo, tipo_pizarron, tipo_banco, posicion_x, posicion_y)
VALUES
('200', 'Tiza', 'Bancos largos', NULL, NULL),
('201', 'Tiza', 'Bancos largos', NULL, NULL),
('202', 'Tiza', 'Bancos largos', NULL, NULL),
('203', 'Tiza', 'Bancos largos', NULL, NULL);
--('204', 'Tiza', 'Bancos largos', NULL, NULL),
--('205', 'Tiza', 'Bancos largos', NULL, NULL),
--('206', 'Tiza', 'Bancos largos', NULL, NULL),
--('207', 'Tiza', 'Bancos largos', NULL, NULL),
--('208', 'Tiza', 'Bancos largos', NULL, NULL),
--('209', 'Tiza', 'Bancos largos', NULL, NULL),
--('210', 'Tiza', 'Bancos largos', NULL, NULL);

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