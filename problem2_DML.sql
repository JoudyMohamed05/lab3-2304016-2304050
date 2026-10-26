USE library;

INSERT INTO author (author_id, name, country) VALUES (1, 'Naguib Mahfouz',   'Egypt');
INSERT INTO author (author_id, name, country) VALUES (2, 'Agatha Christie',  'United Kingdom');
INSERT INTO author (author_id, name, country) VALUES (3, 'Paulo Coelho',     'Brazil');
INSERT INTO author (author_id, name, country) VALUES (4, 'George Orwell',    'United Kingdom');

INSERT INTO book (book_id, title, price, author_id) VALUES (1, 'Palace Walk',                 15.50, 1);
INSERT INTO book (book_id, title, price, author_id) VALUES (2, 'Midaq Alley',                 12.00, 1);
INSERT INTO book (book_id, title, price, author_id) VALUES (3, 'Murder on the Orient Express', 18.75, 2);
INSERT INTO book (book_id, title, price, author_id) VALUES (4, 'And Then There Were None',    14.20, 2);
INSERT INTO book (book_id, title, price, author_id) VALUES (5, 'The Alchemist',               11.99, 3);
INSERT INTO book (book_id, title, price, author_id) VALUES (6, '1984',                        13.40, 4);
INSERT INTO book (book_id, title, price, author_id) VALUES (7, 'Animal Farm',                 9.90,  4);
