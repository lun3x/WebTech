const mysql = require('mysql');
const db = require('../database.js');

// Gets all food from db and returns result to page as JSON
exports.getAllRecipes = (controllerCallback) => {
    let sql = 'SELECT * FROM Recipes;';

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.findRecipeIngredients = (ingredient_ids, controllerCallback) => {
    let sql = 'SELECT * FROM RecipeIngredients';
    // for (let i = 0; i < ingredient_ids.length; i++) {
    //     let whereING;
    //     if (i === 0) {
    //         whereING = ' WHERE ingredient_id = ?';
    //     }
    //     else {
    //         whereING = ' OR WHERE ingredient_id = ?';
    //     }

    //     let inserts = [ ingredient_ids[i] ];
    //     sql = mysql.format(whereING, inserts);

    //     sql += whereING;
    // }

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
            whereING = ' OR WHERE id = ?';
        }

        let inserts = [ recipe_ids[i] ];
        sql = mysql.format(whereING, inserts);

        sql += whereING;
    }

    sql += ';';
    
    console.log(sql);
    db.con.query(sql, controllerCallback);
};
