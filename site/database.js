const mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "pass",
    database: 'mydb',
});

//=== Database functions ===//

// Gets all food from db and returns result to page as JSON
exports.returnIngredients = (res) => {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });
    con.query('SELECT * FROM Ingredients;', (err, dbResult) => {
        if (err) throw err;
        console.log(JSON.stringify(dbResult));
        res.json(dbResult);
    });
}

exports.returnCupboard = (user_id, res) => {
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

exports.addFood = (ingredient_id, cupboard_id, res) => {
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

exports.removeFood = (ingredientCupboard_id, res) => {
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

exports.authenticate = (username, password, req, res) => {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
    let inserts = [username, password];
    sql = mysql.format(sql, inserts);

    con.query(sql, (err, dbResult) => {
        if (dbResult.length == 1) {
            console.log("AUTHENTICATED");
            req.session.authenticated = true;
            res.json({
                success: true
            });
        }
        else {
            console.log("NOT AUTHENTICATED");
            res.json({
                success: false
            });
        }
    });
}
