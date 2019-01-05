
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
    mgrTask();
    
    // connection.end();
  });

  function mgrTask() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "1) View Products for Sale",
          "2) View Low Inventory",
          "3) Add to Inventory",
          "4) Add New Product"
          ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "1) View Products for Sale":
          viewProducts();
          break;
  
        case "2) View Low Inventory":
          lowInventory();
          break;
  
        case "3) Add to Inventory":
          addToInventory();
          break;
  
        case "4) Add New Product":
          addNewProduct();
          break;
        }
      });
  }
  
  function viewProducts(){
    connection.query('SELECT * FROM products', function(err, res){
        if (err) throw err;
        console.log('');
        console.log('========================ITEMS IN STORE=======================');
        for(i=0;i<res.length;i++){
            console.log('Item ID:' + res[i].item_id);
            console.log('Product Name: ' + res[i].product_name);
            console.log('Department Name: ' + res[i].department_name);
            console.log('Price: ' + '$' + res[i].price);
            console.log('Quantity in Stock: ' + res[i].stock_quantity);
            console.log('---------------------');
        }
        // chooseNewTask();
  });
}

function lowInventory(){
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res){
        if (err) throw err;
        console.log('')
        console.log('========================LOW INVENTORY=======================');
        for(i=0;i<res.length;i++){
            if(res[i].stock_quantity < 5) {
            console.log('Item ID: ' + res[i].item_id);
            console.log('Name: ' + res[i].product_name);
            console.log('Quantity in Stock: ' + res[i].stock_quantity);
            console.log('---------------------');
        }
    }   console.log("Currently, there are no products with low inventory");
        mgrTask();
    });
}

function addToInventory(){

    inquirer.prompt([{
        name: 'item_id',
        message: 'Enter the ID of the item you wish to update:',
        validate: function(value){
            var valid = value.match(/^[1-9]$/)
            if(valid){
                return true
            }
                return 'Please enter a numerical value'
            }
    },{
        name: 'number',
        message: 'What is the quantity you would like to add to the current supply?',
        validate: function(value){
            var valid = value.match(/^[0-9]+$/)
            if(valid){
                return true
            }
                return 'Please enter a numerical value'
            }
    }]).then(function(answer){
        connection.query('SELECT * FROM products WHERE item_id = ?', [answer.item_id], function(err, res){
                connection.query('UPDATE products SET ? Where ?', [{
                    
                    stock_quantity: res.stock_quantity + parseInt(answer.number)
                    
                },{
                    item: answer.item_id
                    
                }], function(err, res){});
        })
        console.log('Inventory updated');
        mgrTask();
    });

}

function addNewProduct() {

    inquirer.prompt([{
        name: 'product_name',
        message: 'Enter name of product:'
    },{
        name: 'department_name',
        message: 'Enter a department for this product'
    },{
        name: 'price',
        message: 'Enter a price for this product',
        validate: function(value){
            var valid = value.match(/^[0-9]+$/)
            if(valid){
                return true
            }
                return 'Please enter a numerical value'
            }
    },{
        name: 'stock_quantity',
        message: 'Please enter a stock quantity for this product',
        validate: function(value){
            var valid = value.match(/^[0-9]+$/)
            if(valid){
                return true
            }
                return 'Please enter a numerical value'
            }
    }]).then(function(answer){
        connection.query('INSERT into products SET ?', {
            product_name: answer.product_name,
            department_name: answer.department_name,
            Price: answer.price,
            stock_quantity: answer.stock_quantity
        }, function(err, res){});
        console.log('Database Update Successful');
        mgrTask();
    });


}