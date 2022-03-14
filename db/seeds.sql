INSERT INTO department (dep_name)
VALUES ( "Hr"),
        ( "Produce"),
        ( "Tech"),
        ( "Bingo");


INSERT INTO role (title, salary, department_id)
VALUES ( "Manager", 80, 2),
        ( "stocker", 15, 1),
        ( "cashier", 12, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ( "bob", "ross", 2, 4),
        ( "tom", "batman", 3, 3),
        ( "ron", "tob", 1),
        ( "lon", "dig", 1);