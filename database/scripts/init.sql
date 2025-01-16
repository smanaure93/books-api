CREATE TABLE
  authors (id serial PRIMARY KEY, name VARCHAR (250) NOT NULL);


CREATE TABLE
  books (
    id serial PRIMARY KEY,
    title VARCHAR (250) NOT NULL,
    chapters INT NOT NULL,
    pages INT NOT NULL
  );


CREATE TABLE
  author_book (
    id serial PRIMARY KEY,
    author_id INT NOT NULL,
    book_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors (id),
    FOREIGN KEY (book_id) REFERENCES books (id)
  );

CREATE TABLE
  books_inspirations (
    id serial PRIMARY KEY,
    book_id INT NOT NULL,
    inspiration_id INT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books (id),
    FOREIGN KEY (inspiration_id) REFERENCES books (id)
  );