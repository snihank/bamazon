var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // connection.end();
    supervisorTask();
    
    // connection.end();
  });

  function supervisorTask() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "1) View Product Sales by Departments",
          "2) Create new department"
          ]
      })
      .then(function(answer) {
        switch (answer.choices) {

        case  "1) View Product Sales by Departments":
          viewProductSales();
          break;
  
        case "2) Create new department":
          createDept();
          break;

        }
      });
  }

  function viewProductSales(){



  }
  