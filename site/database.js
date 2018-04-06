const mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "pass",
    database: 'mydb',
});

let maxItemID = 0;

//=== Database functions ===//

// Gets all food from db and returns result to page as JSON
function returnIngredients(res) {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });
    con.query('SELECT * FROM Ingredients;', (err, dbResult) => {
        if (err) throw err;
        console.log(JSON.stringify(dbResult));
        res.json(dbResult);
    });
}

function returnCupboard(user_id, res) {
  con.connect((err) => {
      if (err) console.log('Already connected!');
  });
  let sql = 'SELECT Ingredients.name FROM IngredientCupboards\
             INNER JOIN Ingredients ON IngredientCupboards.ingredient_id = Ingredients.id\
             INNER JOIN Cupboards ON IngredientCupboards.cupboard_id = Cupboards.id\
             WHERE Cupboards.user_id = ?;';

  let inserts = [user_id];

  sql = mysql.format(sql, inserts); // Avoid SQL injection

  con.query(sql, (err, dbResult) => {
    if (err) throw err;
    res.json({
        user_id: user_id,
        food: {
          dbResult
        }
    });
  });
}

function addFood(req, res) {
    maxItemID++;

    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'INSERT INTO food VALUES (?,?,?);';
    let inserts = [maxItemID, req.body.fname, req.body.fquantity];
    sql = mysql.format(sql, inserts); // Avoid SQL injection

    console.log(sql);

    con.query(sql, (err) => {
        if (err) throw err;
        res.json({
            itemID: maxItemID,
            name: req.body.fname,
            quantity: req.body.fquantity,
        });
    });
}

function incrDecrFood(req, res) {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql;

    if (req.body.action === 'plusB') sql = 'UPDATE food SET quantity = quantity + 1 WHERE itemID = ?;';
    else sql = 'UPDATE food SET quantity = quantity - 1 WHERE itemID = ?;';

    let inserts = [req.body.itemID];
    sql = mysql.format(sql, inserts);

    console.log(sql);

    con.query(sql, (err) => {
        if (err) throw err;
        res.json({
            success: true
        });
    });
}

module.exports.addFood = addFood;
module.exports.returnIngredients = returnIngredients;
module.exports.returnCupboard = returnCupboard;
module.exports.incrDecrFood = incrDecrFood;
