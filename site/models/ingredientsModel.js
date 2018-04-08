const mysql = require('mysql');
const db = require('../database.js');

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