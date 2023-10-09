// Import required modules
const inquirer = require('inquirer');
const connection = require('./connection.js');

// Main function to initiate the application
function start() {
    // Prompt user for desired action using inquirer
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            // List of available actions
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        })
        .then(answer => {
            // Switch case to handle the selected action
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    // Close the MySQL connection and exit application
                    connection.end();
                    break;
            }
        });
}

// Function to display all departments in the database
function viewDepartments() {
    // SQL query to select all from the departments table
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;
        // Display the results in a table format in the console
        console.table(results);
        // Return to the main menu
        start();
    });
}

// Function to display all roles in the database
function viewRoles() {
    // SQL query to join roles and departments tables and select required fields
    const query = `
        SELECT roles.id, roles.title, roles.salary, departments.name AS department
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id
    `;
    connection.query(query, (err, results) => {
        if (err) throw err;
        // Display the results in a table format in the console
        console.table(results);
        // Return to the main menu
        start();
    });
}

// Function to display all employees in the database
function viewEmployees() {
    // SQL query to join employees, roles, and departments tables and select required fields
    const query = `
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary
        FROM employees
        INNER JOIN roles ON employees.role_id = roles.id
        INNER JOIN departments ON roles.department_id = departments.id
    `;
    connection.query(query, (err, results) => {
        if (err) throw err;
        // Display the results in a table format in the console
        console.table(results);
        // Return to the main menu
        start();
    });
}

// Function to add a new department to the database
function addDepartment() {
    // Prompt user for the name of the new department
    inquirer
        .prompt({
            name: 'departmentName',
            type: 'input',
            message: 'Enter the name of the new department:',
        })
        .then(answer => {
            // SQL query to insert the new department into the departments table
            connection.query('INSERT INTO departments SET ?', { name: answer.departmentName }, (err) => {
                if (err) throw err;
                console.log('Department added successfully!');
                // Return to the main menu
                start();
            });
        });
}

// Function to add a new role to the database
function addRole() {
    // Prompt user for the title and salary of the new role
    inquirer
        .prompt([
            {
                name: 'roleTitle',
                type: 'input',
                message: 'Enter the title of the new role:',
            },
            {
                name: 'roleSalary',
                type: 'input',
                message: 'Enter the salary for this role:',
            }
        ])
        .then(answer => {
            // SQL query to insert the new role into the roles table
            connection.query('INSERT INTO roles SET ?', 
            { 
                title: answer.roleTitle,
                salary: answer.roleSalary
            }, 
            (err) => {
                if (err) throw err;
                console.log('Role added successfully!');
                // Return to the main menu
                start();
            });
        });
}

// Function to add a new employee to the database
function addEmployee() {
    // Prompt user for the first and last name of the new employee
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'Enter the first name of the employee:',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Enter the last name of the employee:',
            }
        ])
        .then(answer => {
            // SQL query to insert the new employee into the employees table
            connection.query('INSERT INTO employees SET ?', 
            { 
                first_name: answer.firstName,
                last_name: answer.lastName
            }, 
            (err) => {
                if (err) throw err;
                console.log('Employee added successfully!');
                // Return to the main menu
                start();
            });
        });
}

// Function to update an employee's role in the database
function updateEmployeeRole() {
    // Further logic to select an employee and update the role
    console.log('Update employee role functionality to be implemented.');
    // Return to the main menu
    start();
}

// Start the application by calling the main function
start();
