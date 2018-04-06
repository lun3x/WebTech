const mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "pass",
    database: 'mydb',
});

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

    console.log(sql);

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

function addFood(ingredient_id, cupboard_id, res) {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'INSERT INTO IngredientCupboards (ingredient_id, cupboard_id) VALUES (?,?);';
    let inserts = [ingredient_id, cupboard_id];
    sql = mysql.format(sql, inserts); // Avoid SQL injection

    console.log(sql);

    con.query(sql, (err) => {
        res.json({
            success: !err
        });
    });
}

function removeFood(ingredientCupboard_id, res) {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'DELETE FROM IngredientCupboards WHERE id = ?';
    let inserts = [ingredientCupboard_id];
    sql = mysql.format(sql, inserts);

    console.log(sql);

    con.query(sql, (err) => {
        res.json({
            success: !err
        })
    })
}

module.exports.returnIngredients = returnIngredients;
module.exports.returnCupboard = returnCupboard;

module.exports.addFood = addFood;
module.exports.removeFood = removeFood;
