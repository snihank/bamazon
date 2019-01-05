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
    
    displayAll();
    
    // connection.end();
  });
  
  
  function displayAll(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
      if (err) throw err;
      for (var i = 0; i < res.length; i++){
        console.log("" + "\n" + res[i].item_id + " || " + 
                    res[i].product_name + " || "
                    + res[i].department_name + " || " 
                    + res[i].price + " || " + 
                    res[i].stock_quantity  + "\n");
        console.log("==========================================");
        
      } 
      promptCustomer();
    })
  }

  function promptCustomer() {
    inquirer
      .prompt([{
        name: "selectId",
        type: "input",
        message: "Please insert the ID of the product you want to buy?",
        matchId: function(id){
          var validId = id.match(/^[0-9]+$/)
          if(validId){
            return true;
          }
            return "Please enter a valid Id"
        },
        
        name: "selectQuantity",
        type: "input",
        message: "Please order quantity of the product",
        orderQuantity: function(value){
          var quantity = value.match(/^[0-9]+$/);
          if(quantity){
            return true;
          }
            return "Please enter a numeric value"
        }
      }]).then(function(answer){
        connection.query("SELECT * FROM products WHERE item_id = ?",
                          [answer.matchId], function(err,res){
              for(var i = 0; i < res.length; i++){
        if(answer.selectQuantity > res[i].stock_quantity){
          console.log("Order quantity exceeded more than in stock");
        }
        else{
          var total = res[i].price * answer.selectQuantity;
          console.log("Your total Purchase: $" + total);
          connection.query("Update products SET ? Where ?" , [{
            stock_quantity: res[i].stock_quantity - answer.selectQuantity
          },{
          item_id: answer.selectId
          }],function(err, res){});
        }
      }
      })
    
  
    }, function(err, res){})
  };
  
  

    
      



  