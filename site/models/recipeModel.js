const mysql = require('mysql');
const db = require('../database.js');

// Gets all food from db and returns result to page as JSON
exports.getAllRecipes = (controllerCallback) => {
    let sql = 'SELECT * FROM Recipes;';

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.findIngredientNamesOfRecipe = (recipe_id, controllerCallback) => {
    let sql = 'SELECT Ingredients.name FROM RecipeIngredients \
               INNER JOIN Ingredients ON RecipeIngredients.ingredient_id = Ingredients.id \
               WHERE RecipeIngredients.recipe_id = ?;';
    
    let inserts = [ recipe_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.getRecipe = (recipe_id, controllerCallback) => {
    let sql = 'SELECT * FROM Recipes WHERE id = ?;';

    let inserts = [ recipe_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.findRecipeIngredients = (ingredient_ids, controllerCallback) => {
    let sql = 'SELECT * FROM RecipeIngredients;';
    
    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.createRecipe = (name, method, controllerCallback) => {
    let sql = 'INSERT INTO Recipes (name, method, score) VALUES (?, ?, 0);';

    let inserts = [ name, method ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.addIngredientsToRecipe = (recipe_id, ingredient_ids, controllerCallback) => {
    let sql = 'INSERT INTO RecipeIngredients (recipe_id, ingredient_id) VALUES ';

    for (let i = 0; i < ingredient_ids.length; i++) {
        let valueInsert;
        if (i === 0) {
            valueInsert = '(?, ?)';
        }
        else {
            valueInsert = ', (?, ?)';
        }
        let inserts = [ recipe_id, ingredient_ids[i] ];
        valueInsert = mysql.format(valueInsert, inserts);

        sql += valueInsert;
    }

    sql += ';';

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.findRecipes = (recipe_ids, controllerCallback) => {
    let sql = 'SELECT * FROM Recipes';
    for (let i = 0; i < recipe_ids.length; i++) {
        let whereING;
        if (i === 0) {
            whereING = ' WHERE id = ?';
        }
        else {
            whereING = ' OR id = ?';
        }

        let inserts = [ recipe_ids[i] ];
        whereING = mysql.format(whereING, inserts);

        sql += whereING;
    }

    sql += ' ORDER BY score DESC;';
    
    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.updateRecipeScore = (recipe_id, change, controllerCallback) => {
    let sql;
    if      (change === 1)  sql = 'UPDATE Recipes SET score = score + 1 WHERE id = ?;';
    else if (change === 2)  sql = 'UPDATE Recipes SET score = score + 2 WHERE id = ?;';
    else if (change === -1) sql = 'UPDATE Recipes SET score = score - 1 WHERE id = ?;';
    else if (change === -2) sql = 'UPDATE Recipes SET score = score - 2 WHERE id = ?;';
    else                    sql = 'UPDATE Recipes SET score = score WHERE id = ?;';

    let inserts = [ recipe_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};
