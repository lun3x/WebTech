var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "321mowgli123",
  database: "mydb"
});

//=== Database functions ===//

// Gets all food from db and returns result to page as JSON
function returnFood(res) {
    con.connect(function(err) {
        if (err) console.log("Already connected!");
    });
    con.query("SELECT * FROM food;", function(err, dbResult) {
        if (err) throw err;
        console.log(JSON.stringify(dbResult));
        res.json(dbResult);
    });
}

function addFood(req, res) {
    con.connect(function(err) {
        if (err) console.log("Already connected!");
    });
    
    let sql = "INSERT INTO food VALUES (5,?,?);";
    let inserts = [req.body.fname, req.body.fquantity];
    sql = mysql.format(sql, inserts); // Avoid SQL injection
    
    console.log(sql);
    
    con.query(sql, function(err) {
        if (err) throw err;
        res.json({
            name: req.body.fname,
            quantity: req.body.fquantity
        });
    });
}

module.exports.addFood = addFood;
module.exports.returnFood = returnFood;