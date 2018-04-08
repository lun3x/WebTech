const mysql = require('mysql');
const db = require('../database.js');

exports.getUser = (username, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'SELECT * FROM Users WHERE username = ?';
    let inserts = [ username ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.createUser = (name, hashPass, username, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    // create a new user
    let sql = 'INSERT INTO Users (name, password, username) VALUES (?,?,?);';
    let inserts = [ name, hashPass, username ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.updateDefaultCupboard = (cupboard_id, user_id, controllerCallback) => {
    db.con.connect((err) => {
        if (err) console.log('Already connected!');
    });

    let sql = 'UPDATE Users SET default_cupboard_id = ? WHERE id = ?;';
    let inserts = [ cupboard_id, user_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};
