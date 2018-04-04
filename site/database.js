var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  //password: "321mowgli123",
  database: "mydb"
});

var maxItemID = 0;

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
    maxItemID++;

    con.connect(function(err) {
        if (err) console.log("Already connected!");
    });

    let sql = "INSERT INTO food VALUES (?,?,?);";
    let inserts = [maxItemID, req.body.fname, req.body.fquantity];
    sql = mysql.format(sql, inserts); // Avoid SQL injection

    console.log(sql);

    con.query(sql, function(err) {
        if (err) throw err;
        res.json({
            itemID: maxItemID,
            name: req.body.fname,
            quantity: req.body.fquantity,
        });
    });
}

function incrDecrFood(req, res) {
    con.connect(function(err) {
        if (err) console.log("Already connected!");
    });

    let sql;

    if (req.body.action == 'plusB') sql = "UPDATE food SET quantity = quantity + 1 WHERE itemID = ?;";
    else                            sql = "UPDATE food SET quantity = quantity - 1 WHERE itemID = ?;";

    let inserts = [req.body.itemID];
    sql = mysql.format(sql, inserts);

    console.log(sql);

    con.query(sql, function(err) {
        if (err) throw err;
        res.json({
            success: true
        });
    });
}

module.exports.addFood = addFood;
module.exports.returnFood = returnFood;
module.exports.incrDecrFood = incrDecrFood;
