const mysql = require('mysql');
const db = require('../database.js');

// Gets all food from db and returns result to page as JSON
exports.returnIngredients = (controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });
    
    let sql = 'SELECT * FROM Ingredients;';

    console.log(sql);
    db.con.query(sql, controllerCallback);
};
