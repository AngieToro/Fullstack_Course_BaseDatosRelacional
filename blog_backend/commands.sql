-- Database: courseBlogs

-- DROP DATABASE IF EXISTS "courseBlogs";

CREATE DATABASE "courseBlogs"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author text NOT NULL,
	url text NOT NULL,
	title text NOT NULL,
	likes int NOT NULL DEFAULT 0
);

INSERT INTO blogs (author, url, title)
values ('J. K. Rowling', 'https://stories.jkrowling.com/my-story/','Harry Potter and the Philosophers Stone');

INSERT INTO blogs (author, url, title)
values ('J. R. R. Tolkien', 'https://es.wikipedia.org/wiki/J._R._R._Tolkien','The Lord of the Rings');

SELECT *
FROM blogs;