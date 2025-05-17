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
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS aula_materias (
    id_aula INT NOT NULL,
    id_materia INT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL
);

INSERT INTO aulas
(codigo, tipo_pizarron, tipo_banco, posicion_x, posicion_y)
VALUES
('200', 'Tiza', 'Bancos largos', NULL, NULL),
('201', 'Tiza', 'Bancos largos', NULL, NULL),
('202', 'Tiza', 'Bancos largos', NULL, NULL),
('203', 'Tiza', 'Bancos largos', NULL, NULL),
('204', 'Tiza', 'Bancos largos', NULL, NULL),
('205', 'Tiza', 'Bancos largos', NULL, NULL),
('206', 'Tiza', 'Bancos largos', NULL, NULL),
('207', 'Tiza', 'Bancos largos', NULL, NULL),
('208', 'Tiza', 'Bancos largos', NULL, NULL),
('209', 'Tiza', 'Bancos largos', NULL, NULL),
('210', 'Tiza', 'Bancos largos', NULL, NULL);

INSERT INTO materias
(codigo, nombre)
VALUES
('60.09', 'Analisis Numerico'),
('60.19', 'Sistemas Operativos'),
('60.20', 'Tecnicas de Diseño');