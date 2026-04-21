CREATE DATABASE escuela;
USE escuela;

-- una vez creada la base de datos empezamos a crear las tablas en orden de dependencia
--osea que primero creamos las que son mas independientes y la ultima es la que mas fk tenga
-- hacemos esto asi ya que sino salta el error 1452, al menos en mariadb, y por terminal.

-- Carreras (PADRE)
CREATE TABLE carreras (
    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

-- Profesores (PADRE)
CREATE TABLE profesores (
    id_profesor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100)
);

-- Alumnos (depende de carreras)
CREATE TABLE alumnos (
    id_alumno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    edad INT,
    dni VARCHAR(20) UNIQUE,
    email VARCHAR(100),
    id_carrera INT,
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
);

-- Materias (depende de profesores y carreras)
CREATE TABLE materias (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    curso VARCHAR(50),
    id_profesor INT,
    id_carrera INT,
    FOREIGN KEY (id_profesor) REFERENCES profesores(id_profesor),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
);