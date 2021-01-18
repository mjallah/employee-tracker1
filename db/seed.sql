INSERT INTO department (dept_name)
VALUES ('Higher Ups'),	
		('Sales'),
		('Finance'),
		('Test Subjects'),
		('Human Resources'),
		('Legal');
       
INSERT INTO employee_tracker_db.role (title, salary, department_id)
VALUES ('Founder', 200000, 1),
		('CEO',150000,1),
       ('CFO', 110000, 1),
       ('Sales Manager', 83000, 2),
       ('Sales Associate', 57000, 2),
       ('Sales Intern', 42000, 2),
       ('Financial Manager', 85000, 3),
       ('Financial Analyst', 75000, 3),
       ('Financial Advisor', 67000, 3),
       ('Lead Guinea Pig', 23000, 4),
       ('Guinea Pig Associate', 18000, 4),
       ('Intern Guinea Pig', 15000, 4),
       ('Head of HR', 65000, 5),
       ('HR Administrator', 42000, 5),
       ('HR Intern', 35000, 5),
       ('Head of Legal', 100000, 6),
       ('Corporate Lawyer', 85000, 6),
       ('Legal Intern', 45000, 6);
     
INSERT INTO employee(first_name, last_name, role_id)
VALUES('Jacob', 'Demille', 1),
      ('Brian', 'OBrien', 4),
      ('Willy', 'Nelson', 7),
      ('Tyler', 'Potts', 10),
      ('Michael', 'Hannon', 13),
      ('Connor', 'Bair', 16);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Malik', 'Jallah', 2, 1),
      ('Charlie', 'Sir', 5, 2),
	  ('Reed', 'Wawrzyniak', 18, 3),
      ('Tyler', 'Johnson', 11, 4),
      ('Ben', 'Buthe', 14, 5),
      ('Adam', 'Schmitz', 17, 6),
      ('Nick', 'Hanson', 3, 1);
       