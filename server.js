const inquirer = require('inquirer');
const sql = require('mysql2');
const cTable = require('console.table')

//creates database connection
const db = sql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "admin",
        database: "hw12_db",
    },
);

//starts command line
function init() {
    //main menu options
inquirer.prompt([
    {
        name: "option",
        type: "list",
        choices: [
            {
            name: "View all departments",
            value: "view_department"
            },
            {
            name: "View all roles",
            value: "view_role"
            },
            {
            name: "View all employess",
            value: "view_employee"
            },
            {
                name: "Add a department",
                value: "add_department"
            }, 
            {
                name: "Add a role",
                value: "add_role"
            }, 
            {
                name: "Add an employee",
                value: "add_employee"
            },
            {
                name: "Update an employee",
                value: "update"
            }  
        ],
        message: "what would you like to do today?",
    },
]).then(answers => {
    //responds with correct view of correct table
    if (answers.option.includes("view")) {
        const view = answers.option.split("_").pop();
        viewArea(view);
    } 
    //checks the right area to add new data to
    if (answers.option === "add_department") {
            createDepartment()
    } else if (answers.option === "add_role") {
            createRole() 
    } else if(answers.option === "add_employee") {
            createEmployee()
    }
    //updates existing employee role
    if (answers.option === "update") {
        updateEmployee();
    }
       
});
}

function transition() {
    inquirer.prompt([
        {
            name: "weee",
            type: "confirm",
            message: "Would you like to do something else?"
        }
    ]).then(answer => {
        if (answer.weee === true) {
            init()
        } else {
            process.exit(1)
        }
    })
}

function viewArea(area) {
    //queries database for table display
    db.query(`SELECT * FROM ${area}`, function (err, results) {
        console.table(results);
        transition();    
    });
}

function createDepartment() {
    //adds department into table
    inquirer.prompt([
        {
            name: "dep_name",
            type: "input",
            message: "What is the name of the Department?"
        },
    ]).then(ans => {
        db.query("INSERT INTO department(dep_name ) values(?)", [ans.dep_name]);
        transition();
    })
}

function createRole() {
    // adds a role to the table
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is this roles title?"
        },
        {
            name: "salary",
            type: "Decimal",
            message: "What is this role's salary?"
        },
    ])
    .then(answers => {
        db.query("SELECT * FROM department", function (err, results) {
            const departments = results.map(({ id, dep_name }) => ({
                name: dep_name,
                value: id,
            }));
            inquirer.prompt(
                {
                    type: "list",
                    name: "id",
                    message: "What department is this role in?",
                    choices: departments
                },
            )
            .then(dep => {
                db.query("INSERT INTO role (title, salary, department_id) values(?, ?, ?)", 
                [answers.title, answers.salary, dep.id]
                );
                transition();
                });
            });
        });
}

function createEmployee() {
    // adds an employee to the employee table
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "whats the employees first name"
        },
        {
            name: "lastName",
            type: "input",
            message: "whats the employees last name"
        },
    ])
    .then((answers) => {
        db.query("select * FROM role", function (err, results) {
            
            const roles = results.map(({ id, title }) => ({
                name: title,
                value: id,

            }));
            inquirer.prompt(
                {
                    type: "list",
                    name: "id",
                    message: "What is the employee's role?",
                    choices: roles
                }
        ).then((role) => {
            db.query("select * FROM employee WHERE manager_id is null", function (err, results) {
                const managers = results.map(({ id, last_name }) => ({
                    name: last_name,
                    value: id,
    
                }));
                inquirer.prompt(
                    {
                        type: "list",
                        name: "id",
                        message: "What is the managers name",
                        choices: managers
                    }
            ).then((manager) => {
                db.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?, ?, ?, ?)", 
                [answers.firstName, answers.lastName, role.id, manager.id]
                );
                transition();
                });
                
            });
            });
        });
        
    });
    
}

function updateEmployee() {
    // changes selected employee's role
    db.query("SELECT * FROM employee", function (err, res) {
        const employees = res.map(({ id, last_name }) => ({
            name: last_name,
            value: id,

        }));
        inquirer.prompt(
            {
                type: "list",
                name: "id",
                message: "Which employee would you like to update?",
                choices: employees
            }
        ).then(emp => {
            db.query("SELECT * FROM role", function (err, res) {
                const roles = res.map(({ id, title }) => ({
                    name: title,
                    value: id,
                }));
                inquirer.prompt(
                    {
                        type: "list",
                        name: "roleList",
                        message: "What is their new role?",
                        choices: roles
                    }
                ).then(role => {
                    
                    db.query(`UPDATE employee SET role_id = ${role.roleList} WHERE id = ${emp.id};`);
                
                    transition();
                });
                
            }); 
                
        });
    });
    
}

init();