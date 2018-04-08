const mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
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
};

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
            user_id,
            data: {
                cupboard: {
                    food: dbResult
                }
            }
        });
    });
};

exports.addFood = (req, res) => {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'SELECT * FROM Cupboards WHERE id = ?;';
    let inserts = [req.params.cupboard_id];
    sql = mysql.format(sql, inserts);

    console.log(sql);

    con.query(sql, (err, dbResult) => {
        if (err) throw err;
        if (dbResult.length == 1 && dbResult[0].user_id == req.session.user_id) {
            sql = 'INSERT INTO IngredientCupboards (ingredient_id, cupboard_id) VALUES (?,?);';
            inserts = [req.params.ingredient_id, req.params.cupboard_id];
            sql = mysql.format(sql, inserts);

            con.query(sql, (err) => {
                res.json({
                    success: !err
                });
            });
        }
    });
};

exports.removeFood = (req, res) => {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'DELETE ic FROM IngredientCupboards ic\
               INNER JOIN Cupboards c ON IngredientCupboards.cupboard_id = Cupboards.id\
               WHERE IngredientCupboards.id = ?\
               AND Cupboards.user_id = ?';

    let inserts = [req.params.foodID, req.session.user_id];
    sql = mysql.format(sql, inserts);

    con.query(sql, (err) => {
        res.json({
            success: !err
        });
    });

    console.log(sql);
};

exports.authenticate = (username, password, req, res) => {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
    let inserts = [username, password];
    sql = mysql.format(sql, inserts);

    con.query(sql, (err, dbResult) => {
        if (dbResult.length === 1) {
            console.log('AUTHENTICATED');
            req.session.authenticated = true;
            req.session.user_id = dbResult[0].id;
            console.log(dbResult[0].id);
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
};

exports.registerUser = (req, res) => {
    con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'INSERT INTO Users (name, password, username) VALUES (?,?,?);';
    let inserts = [req.body.name, req.body.password, req.body.username];
    sql = mysql.format(sql, inserts);

    con.query(sql, (err) => {
        if (err) {
            res.status(401).json({
                fail: 'usernameTaken'
            });
        } else {
            res.status(201).json({
                fail: 'none'
            });
        }
    });
};
