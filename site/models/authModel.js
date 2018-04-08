const mysql = require('mysql');
const db = require('../database.js');

exports.getUser = (username, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'SELECT * FROM Users WHERE username = ?';
    let inserts = [ username ];
    sql = mysql.format(sql, inserts);

    db.con.query(sql, controllerCallback);
};

exports.createUser = (name, hashPass, username, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'INSERT INTO Users (name, password, username) VALUES (?,?,?);';
    let inserts = [name, hashPass, username];
    sql = mysql.format(sql, inserts);

    db.con.query(sql, controllerCallback);
};