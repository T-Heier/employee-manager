const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Your password
    password: 'root',
    database: 'employee_manager_db',
});

connection.connect((err) => {
    if (err) throw err;
    startCreation()
})

const startCreation = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View departments',
                'View employees',
                'View employee roles',
                'Create a department',
                'Create employee role',
                'Create employee',
                'Update employee role',
                'Exit',
            ],
        })
        // switch statement to pick which function you would like to run from the inquirer prompt
        .then((answer) => {
            switch (answer.action) {
                case 'View departments':
                    viewDepartments();
                    break;
                case 'View employees':
                    viewEmployee();
                    break;
                case 'View employee roles':
                    viewRoles();
                    break;
                case 'Create a department':
                    createDepartment();
                    break;
                case 'Create employee role':
                    createEmployeeRole();
                    break;
                case 'Create employee':
                    createEmployee();
                    break;
                case 'Update employee role':
                    updateRole();
                case 'Exit':
                    connection.end();
                    break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
};

const createDepartment = () => {
    // inquirer prompt to create and name your new department
    inquirer
    .prompt({
        name: 'department',
        type: 'input',
        message: 'What is the department you are wanting to create',
    })
    .then((answer) => {
        connection.query(
            
            'INSERT INTO department SET ?',
            {
            name: answer.department
        },
        (err) => {
            if (err) throw err;
            console.log(`You have successfully created a department`);
            startCreation();
            }
        );
    });
};

const createEmployeeRole = () => {
    let query = 'VIEW employee_manager_db AS SELECT name FROM department'
    connection.query(query)

    inquirer
    .prompt([
        {
            name: 'title',
            type: 'input',
            message: "What is the role name?",
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is this roles salary'
        },
        {
            name: 'department'
        }
    ]);
}

const viewDepartments = () => {
    connection.query('SHOW TABLES FROM employee_manager_db')
    
}

const viewEmployee = () => {

}

const viewRoles = () => {

}

