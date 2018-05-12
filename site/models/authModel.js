const mysql = require('mysql');
const db = require('../database.js');

exports.getUser = (username, controllerCallback) => {
    let sql = 'SELECT * FROM Users WHERE username = ?';
    let inserts = [ username ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.changePassword = (user_id, hashPass, controllerCallback) => {
    let sql = 'UPDATE Users SET password = ? WHERE id = ?;';
    let inserts = [ hashPass, user_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.createUser = (name, hashPass, username, controllerCallback) => {
    // create a new user
    let sql = 'INSERT INTO Users (name, password, username) VALUES (?,?,?);';
    let inserts = [ name, hashPass, username ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.deleteUser = (user_id, controllerCallback) => {
    // deletes an existing user
    let sql = 'DELETE FROM Users WHERE id = ?;';
    let inserts = [ user_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.updateDefaultCupboard = (cupboard_id, user_id, controllerCallback) => {
    let sql = 'UPDATE Users SET default_cupboard_id = ? WHERE id = ?;';
    let inserts = [ cupboard_id, user_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};
