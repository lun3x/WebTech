const mysql = require('mysql');
const db = require('../database.js');

// Gets all food from db and returns result to page as JSON
exports.getAllRecipes = (controllerCallback) => {
    let sql = 'SELECT * FROM Recipes;';

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.findRecipes = (ingredient_ids, controllerCallback) => {
    let sql = 
        '';
    
    console.log(sql);
    db.con.query(sql, controllerCallback);
};
