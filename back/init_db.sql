

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
('E1', NULL, NULL),
('E3', NULL, NULL),
('E5', NULL, NULL),
('E7', NULL, NULL),
('E9', NULL, NULL),
('E14', NULL, NULL),
('105', NULL, NULL),
('107', NULL, NULL),
('200', NULL, NULL),
('201', NULL, NULL),
('202', NULL, NULL),
('203', NULL, NULL),
('211B', NULL, NULL),
('211C', NULL, NULL),
('221', NULL, NULL),
('222', NULL, NULL),
('302', NULL, NULL),
('303', NULL, NULL),
('305', NULL, NULL),
('310', NULL, NULL),
('313', NULL, NULL),
('319', NULL, NULL),
('400', NULL, NULL),
('401', NULL, NULL),
('402', NULL, NULL),
('403', NULL, NULL),
('404', NULL, NULL),
('407', NULL, NULL),
('411', NULL, NULL),
('414', NULL, NULL),
('416', NULL, NULL),
('418', NULL, NULL),
('422', NULL, NULL),
('500', NULL, NULL),
('506', NULL, NULL),
('507', NULL, NULL),
('509', NULL, NULL),
('510', NULL, NULL),
('511', NULL, NULL),
('512', NULL, NULL),
('513', NULL, NULL),
('A1', NULL, NULL),
('A2', NULL, NULL);

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

('E1', 'Capacidad', '49'),
('E3', 'Capacidad', '60'),
('E5', 'Capacidad', '60'),
('E7', 'Capacidad', '68'),
('E9', 'Capacidad', '96'),
('E14', 'Capacidad', '56'),

('105', 'Capacidad', '40'),
('107', 'Capacidad', '81'),

('200', 'Tipo Pizarron', 'Tiza'),
('200', 'Tipo banco', 'individual'),
('200', 'Ventilacion', 'ventilador'),
('200', 'Cantidad enchufes', '2'),
('200', 'Capacidad', '168'),

('201', 'Tipo Pizarron', 'Tiza'),
('201', 'Tipo banco', 'Iglesia'),
('201', 'Ventilacion', 'aire acondicionado'),
('201', 'Cantidad enchufes', '1'),
('201', 'Capacidad', '156'),

('202', 'Tipo Pizarron', 'Marcador'),
('202', 'Tipo banco', 'Individual'),
('202', 'Ventilacion', 'Ventanas'),
('202', 'Cantidad enchufes', '0'),
('202', 'Capacidad', '86'),

('203', 'Capacidad', '118'),
('211B', 'Capacidad', '20'),
('211C', 'Capacidad', '18'),
('221', 'Capacidad', '65'),
('222', 'Capacidad', '65'),

('302', 'Capacidad', '112'),
('303', 'Capacidad', '67'),
('305', 'Capacidad', '68'),
('310', 'Capacidad', '124'),
('313', 'Capacidad', '120'),
('319', 'Capacidad', '50'),

('400', 'Capacidad', '200'),
('401', 'Capacidad', '25'),
('402', 'Capacidad', '35'),

('403', 'Tipo Pizarron', 'Tiza'),
('403', 'Tipo banco', 'Iglesia'),
('403', 'Ventilacion', 'Ventanas'),
('403', 'Cantidad enchufes', '2'),
('403', 'Capacidad', '208'),

('404', 'Capacidad', '24'),
('407', 'Capacidad', '50'),
('411', 'Capacidad', '96'),
('414', 'Capacidad', '112'),
('416', 'Capacidad', '50'),
('418', 'Capacidad', '116'),
('422', 'Capacidad', '30'),

('500', 'Capacidad', '204'),
('506', 'Capacidad', '89'),
('507', 'Capacidad', '61'),
('509', 'Capacidad', '55'),
('510', 'Capacidad', '116'),
('511', 'Capacidad', '20'),
('512', 'Capacidad', '10'),
('513', 'Capacidad', '25'),

('A1', 'Capacidad', '30'),
('A2', 'Capacidad', '35');
