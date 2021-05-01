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
    let departmentsArray = []
    const departmentChoices = () => {
        connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) 
        departmentsArray.push(res[i].name);
        })
        return departmentsArray;
    }   
    

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
            choices: departmentChoices(),
        }
        
    ]).then(function (answer) {
        let department_id = departmentChoices().indexOf(answer.department) + 1;
        let role = { 
            title: answer.title,
            salary: answer.salary,
            department_id: department_id,            
        };

        connection.query(
            'INSERT INTO role SET ?', role,
            function (err, res) {
                if(err)throw err;
                console.table(res);
                viewRoles();
            })
    })
})
};

const createEmployee = () => {
    let managerArray = []
    const getManager = () => {
        connection.query("SELECT * FROM employee", function (err, res) {
            if (err) throw err
            for (j = 0; j < res.length; j++)
            managerArray.push(res[j].id)
        });
        return managerArray;
    }


    let rolesArray = []
    const roleChoice = () => {
        connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) 
        rolesArray.push(res[i].title);
        })
        return rolesArray;
    }   
    

    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err

        inquirer
        .prompt([
        {
            name: 'name',
            type: 'input',
            message: "What is the employee's name?",
        },
        {
            name: 'lastName',
            type: 'input',
            message: `What is the employee's last name`
        },
        {
            name: 'role',
            type: 'list',
            message: "What role does your employee have",
            choices: roleChoice(),
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the manager of this employee?",
            choices: getManager(),
        }
        
    ]).then(function (answer) {
        let role_id = roleChoice().indexOf(answer.role) + 1;
        let employee = { 
            first_name: answer.name,
            last_name: answer.lastName,
            role_id: role_id,
            manager_id: answer.manager,
        };

        connection.query(
            'INSERT INTO employee SET ?', employee,
            function (err, res) {
                if(err)throw err;
                console.table(res);
                viewEmployee();
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

