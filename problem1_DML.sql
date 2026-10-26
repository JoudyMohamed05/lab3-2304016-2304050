USE company;

-- 1) departments first, manager still NULL (the employee does not exist yet)
INSERT INTO department (Dnumber, Dname, mgr_ssn, mgr_start_date) VALUES (1, 'Research',       NULL, NULL);
INSERT INTO department (Dnumber, Dname, mgr_ssn, mgr_start_date) VALUES (2, 'Administration', NULL, NULL);
INSERT INTO department (Dnumber, Dname, mgr_ssn, mgr_start_date) VALUES (3, 'Headquarters',   NULL, NULL);

-- 2) employees (their departments exist now)
INSERT INTO employee (ssn, fname, lname, bdate, address, gender, salary, Dno) VALUES ('111111111', 'Joudy',  'Mohamed', '2005-03-12', 'Alexandria', 'F', 9000.00, 1);
INSERT INTO employee (ssn, fname, lname, bdate, address, gender, salary, Dno) VALUES ('222222222', 'Raneem', 'Ahmed',   '2005-07-25', 'Cairo',      'F', 8500.50, 2);
INSERT INTO employee (ssn, fname, lname, bdate, address, gender, salary, Dno) VALUES ('333333333', 'Omar',   'Hassan',  '1990-01-15', 'Giza',       'M', 12000.00, 3);
INSERT INTO employee (ssn, fname, lname, bdate, address, gender, salary, Dno) VALUES ('444444444', 'Sara',   'Adel',    '1995-11-02', 'Alexandria', 'F', 7000.00, 1);

-- 3) now set the managers
UPDATE department SET mgr_ssn = '111111111', mgr_start_date = '2024-01-01' WHERE Dnumber = 1;
UPDATE department SET mgr_ssn = '222222222', mgr_start_date = '2024-06-01' WHERE Dnumber = 2;
UPDATE department SET mgr_ssn = '333333333', mgr_start_date = '2023-09-15' WHERE Dnumber = 3;

-- 4) projects
INSERT INTO project (Pnumber, Pname, Plocation, Dno) VALUES (10, 'ProductX',      'Alexandria', 1);
INSERT INTO project (Pnumber, Pname, Plocation, Dno) VALUES (20, 'Computerization','Cairo',      2);
INSERT INTO project (Pnumber, Pname, Plocation, Dno) VALUES (30, 'Reorganization', 'Giza',       3);
