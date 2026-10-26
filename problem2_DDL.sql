DROP DATABASE IF EXISTS library;
CREATE DATABASE library;
USE library;

CREATE TABLE author (
  author_id INT          NOT NULL AUTO_INCREMENT,
  name      VARCHAR(100) NOT NULL,
  country   VARCHAR(50),
  image     VARCHAR(255),            -- bonus: photo file name
  PRIMARY KEY (author_id)
);

CREATE TABLE book (
  book_id   INT           NOT NULL AUTO_INCREMENT,
  title     VARCHAR(150)  NOT NULL,
  price     DECIMAL(10,2) NOT NULL,
  author_id INT           NOT NULL,
  image     VARCHAR(255),            -- bonus: cover file name
  PRIMARY KEY (book_id),
  FOREIGN KEY (author_id) REFERENCES author(author_id) ON DELETE CASCADE
);

-- Login / register (from Lab 2)
CREATE TABLE users (
  user_id           INT          NOT NULL AUTO_INCREMENT,
  email             VARCHAR(255) NOT NULL,
  name              VARCHAR(100) NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  registration_date TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE (email)
);
