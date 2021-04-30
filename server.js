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
    database: 'employee_manager_DB',
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
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err

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
            name: 'department',
            type: 'list',
            message: "Which department should your new role belong to",
            choices: function() {
                let array = [];
                for (let i = 0; i < res.length; i++) {
                array.push(res[i].name);
                }
                return array;
            },
        }
    ]).then(function (answer) {
        let department_id;
        for (let a = 0; a < res.length; a++) {
            if (res[a].name == answer.Department) {
                department_id = res[a].id;
            }
        }

        connection.query(
            'INSERT INTO role SET ?',
            {
                title: answer.title,
                salary: answer.salary,
                department_id: department
            },
            function (err, res) {
                if(err)throw err;
                console.table(res);
                options();
            })
    })
})
};


const viewDepartments = () => {
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.log('Departments')
        console.table(res)
        startCreation();
    });
}

const viewEmployee = () => {
    var query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.log("Employees")
        console.table(res);
        startCreation();
    });
}

const viewRoles = () => {
    var query = 'SELECT * FROM role';
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.log("Roles")
        console.table(res);
        startCreation();
    });
}

