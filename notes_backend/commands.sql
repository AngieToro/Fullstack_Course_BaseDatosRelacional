-- Database: courseNotes
DROP DATABASE IF EXISTS "courseNotes";

CREATE DATABASE "courseNotes"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);

INSERT INTO notes (content, important)
values ('Relational databases rule the world', true);

INSERT INTO notes (content, important)
values ('MongoDB is webscale', false);

SELECT *
FROM notes;

DROP TABLE notes;