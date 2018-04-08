const mysql = require('mysql');
const db = require('../database.js');

// Gets all food from db and returns result to page as JSON
exports.returnIngredients = (controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });
    db.con.query('SELECT * FROM Ingredients;', controllerCallback);
};
