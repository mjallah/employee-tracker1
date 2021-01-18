//require dependancies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const logo = require('asciiart-logo');



let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Jdnm#1124",
    database: "employee_tracker_db"
});

// connect to the mysql server
connection.connect(function (err) {
    if (err) throw err;
    init();
});

//logo
function init() {
    const logoText = logo
        ({
            name: "Employee Management System",
            fontSize: "5px",
            borderColor: "black",
            logoColor: "red",
            textColor: "bold-black",
        })
        .render();
    console.log(logoText);

    setTimeout(() => {
        start();
    }, 2000);

};

let rolesarray = [];
let departmentsarray = [];
let employeesarray = [];
let managersarray = [];


function start() {
    //Run functions to make empty arrays at start
    roleArray();
    departmentArray();
    employeeArray();
    managerArray();
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View All Departments",
                "View All Roles",
                "View all Employees",
                "Remove Employee",
                "Remove Role",
                "Remove Department",
                "Update Employee's Role",
                "Exit",
            ],
        })
        .then(function (answer) {
            switch (answer.choice) {
                case "Add Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "View All Departments":
                    viewDepartments();
                    break;

                case "View All Roles":
                    viewRoles();
                    break;

                case "View all Employees":
                    viewEmployees();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Remove Role":
                    removeRole();
                    break;

                case "Remove Department":
                    removeDepartment();
                    break;

                case "Update Employee's Role":
                    updateRole();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}


//function to view employees
function viewEmployees() {
    let query =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;";
    return connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

//fucntion to add an employee
function addEmployee() {
    //Add this answer to manager question
    managersarray.push('This Employee is a manager.');

    inquirer
        .prompt([
            {
                name: "firstname",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastname",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "employeeRole",
                type: "list",
                choices: rolesarray,
                message: "What is the employee's role?"
            },
            {
                name: "managerId",
                type: "list",
                choices: managersarray,
                message: "Please choose the employees manager"
            }
        ])
        .then(function (answer) {
            if (answer.managerId === "This Employee is a manager.") {
                answer.managerId = null;

                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstname,
                        last_name: answer.lastname,
                        role_id: answer.employeeRole[0],
                        manager_id: answer.managerId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The employee has been added");
                        start();
                    }
                );
            } else {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstname,
                        last_name: answer.lastname,
                        role_id: answer.employeeRole[0],
                        manager_id: answer.managerId[0]
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The employee has been added");
                        start();
                    }
                );
            };
        });
};

//function to remove employees
function removeEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "removeNames",
                    type: "list",
                    choices: function () {
                        let removeArray = [];
                        for (let i = 0; i < results.length; i++) {
                            removeArray.push(results[i].first_name + " " + results[i].last_name);
                        }
                        return removeArray;
                    },
                    message: "Which employee would you like to remove?"
                }
            ])
            .then(function (answer) {
                let employee_id;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].first_name + " " + results[i].last_name === answer.removeNames) {
                        employee_id = results[i].id;
                        console.log("This is the emp ID " + employee_id);
                        let query = employee_id
                        connection.query("DELETE FROM employee WHERE employee.id = ?", query, (err, res) => {
                            if (err) throw err;
                            console.log("Employee has been removed");
                            start();
                        })
                    };
                };
            });
    });
};




//function to add a department
function addDepartment() {
    inquirer
        .prompt([
            {
                name: "deptName",
                type: "input",
                message: "What would you like added to the department list?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    dept_name: answer.deptName
                },
                function (err) {
                    if (err) throw err;
                    console.log("The department has been added");
                    start();
                }
            );
        });
};

//function for viewing all departments
function viewDepartments() {

    let query =
        "SELECT department.id, department.dept_name FROM department";
    return connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

//function to remove a department
function removeDepartment() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "removeDepartment",
                    type: "list",
                    choices: function () {
                        let removeArray = [];
                        for (let i = 0; i < results.length; i++) {
                            removeArray.push(results[i].dept_name);
                        }
                        return removeArray;
                    },
                    message: "Which department would you like to remove?"
                }
            ])
            .then(function (answer) {
                let departId;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].dept_name === answer.removeDepartment) {
                        departId = results[i].id;

                        connection.query(
                            "DELETE FROM department WHERE id = ?", departId, (err, res) => {
                                if (err) throw err;
                                console.log("Department has been successfully removed!");
                                start();
                            })
                    };
                };
            });
    });
};

//add a role
function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the role you would like added?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is this role's salary?"
            },
            {
                name: "department",
                type: "list",
                choices: departmentsarray,
                message: "Please select which department this role belongs to"
            }
        ])
        .then(function (answer) {
            if (answer.salary === isNaN) {
                console.log("You must enter a valid number")
            } else {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department[0]
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The role was added");
                        start();
                    }
                );
            };
        });
};

//view all roles
function viewRoles() {
    console.log("View All Roles Test")
    let query =
        "SELECT role.id, role.title, role.salary, role.department_id FROM role";
    return connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start()
    })
};

//update roles
function updateRole() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id FROM employee", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "empNames",
                    type: "list",
                    choices: function () {
                        let empArray = [];
                        for (let i = 0; i < results.length; i++) {
                            empArray.push(results[i].first_name + " " + results[i].last_name);
                        }
                        return empArray;
                    },
                    message: "Which employee would you like to update the role for?"
                },
            ])
            .then(function (answer) {
                let employee_id;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].first_name + " " + results[i].last_name === answer.empNames) {
                        employee_id = results[i].id;
                        console.log("This is the emp ID " + employee_id);
                    };
                };

                connection.query("SELECT * FROM role", function (err, results) {
                    if (err) throw (err);

                    inquirer
                        .prompt([
                            {
                                name: "roles",
                                type: "list",
                                choices: function () {
                                    let roleArray = [];
                                    for (let i = 0; i < results.length; i++) {
                                        roleArray.push(results[i].title);
                                    }
                                    return roleArray;
                                },
                                message: "Please select a role to update the employee to:"
                            }
                        ])
                        .then(function (answer) {
                            let role_id;
                            for (let i = 0; i < results.length; i++) {
                                if (results[i].title === answer.roles) {
                                    role_id = results[i].id;
                                    console.log("This is the role id " + role_id);
                                }
                            }

                            let queryAnswer = [role_id, employee_id]
                            connection.query("UPDATE employee SET role_id = ? WHERE employee.id = ?", queryAnswer, (err, res) => {
                                if (err) throw err;
                                console.log("Employee was updated");
                                start();
                            });
                        });
                });
            });
    });
};

//remove role function
function removeRole() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "removeRoles",
                    type: "list",
                    choices: function () {
                        let removeArray = [];
                        for (let i = 0; i < results.length; i++) {
                            removeArray.push(results[i].title);
                        }
                        return removeArray;
                    },
                    message: "Which role would you like to remove?"
                }
            ])
            .then(function (answer) {
                let role_id;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answer.removeRoles) {
                        role_id = results[i].id;

                        let query = role_id;
                        connection.query("DELETE FROM role WHERE role.id = ?", query, (err, res) => {
                            if (err) throw err;
                            console.log("Role has been removed");
                            start();
                        })
                    };
                };
            });
    });
};

//array functions
function roleArray() {
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        rolesarray = [];
        for (let i = 0; i < results.length; i++) {
            rolesarray.push(results[i].id + " " + results[i].title)
        };
    });
};

function employeeArray() {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        employeesarray = [];
        for (let i = 0; i < results.length; i++) {
            employeesarray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name)
        };
    });
};

function departmentArray() {
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        departmentsarray = [];
        for (let i = 0; i < results.length; i++) {
            departmentsarray.push(results[i].id + " " + results[i].dept_name)
        };
    });
};

function managerArray() {
    connection.query("SELECT * FROM employee WHERE manager_id IS null", (err, results) => {
        if (err) throw err;
        managersarray = [];
        for (let i = 0; i < results.length; i++) {
            managersarray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name)
        };
    });
};