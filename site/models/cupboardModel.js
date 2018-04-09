const mysql = require('mysql');
const db = require('../database.js');

exports.getCupboardIngredients = (cupboard_id, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'SELECT IngredientCupboards.id, Ingredients.name FROM IngredientCupboards\
             INNER JOIN Ingredients ON IngredientCupboards.ingredient_id = Ingredients.id\
             INNER JOIN Cupboards ON IngredientCupboards.cupboard_id = Cupboards.id\
             WHERE Cupboards.id = ?;';
             
    let inserts = [ cupboard_id ];
    sql = mysql.format(sql, inserts); // Avoid SQL injection

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.getCupboard = (cupboard_id, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'SELECT * FROM Cupboards WHERE id = ?;';
    let inserts = [ cupboard_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.createCupboard = (user_id, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'INSERT INTO Cupboards (user_id) VALUES (?)';
    let inserts = [ user_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.createIngredientCupboard = (ingredient_id, cupboard_id, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'INSERT INTO IngredientCupboards (ingredient_id, cupboard_id) VALUES (?,?);';
    let inserts = [ ingredient_id, cupboard_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.deleteIngredientCupboard = (ingredientC_id, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'DELETE FROM IngredientCupboards\
               WHERE IngredientCupboards.id = ?';

    let inserts = [ ingredientC_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};
