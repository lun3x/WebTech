const mysql = require('mysql');
const db = require('../database.js');

// Gets all food from db and returns result to page as JSON
exports.getVoteStatus = (recipe_id, user_id, controllerCallback) => {
    let sql = 'SELECT * FROM Votes WHERE recipe_id = ? AND user_id = ?;';

    let inserts = [ recipe_id, user_id ];
    sql = mysql.format(sql, inserts);

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.createVote = (recipe_id, user_id, upvote, controllerCallback) => {
    let sql = 'INSERT INTO Votes (recipe_id, user_id, upvote) VALUES (?, ?, ?);';
    
    let inserts = [ recipe_id, user_id, upvote ];
    sql = mysql.format(sql, inserts);
    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.deleteVote = (recipe_id, user_id, controllerCallback) => {
    let sql = 'DELETE FROM Votes WHERE recipe_id = ? AND user_id = ?;';
    let inserts = [ recipe_id, user_id ];
    sql = mysql.format(sql, inserts);
    
    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.updateVote = (recipe_id, user_id, upvote, controllerCallback) => {
    let sql = 'UPDATE Votes SET upvote = ? WHERE recipe_id = ? AND user_id = ?;';
    let inserts = [ upvote, recipe_id, user_id ];
    sql = mysql.format(sql, inserts);
    
    console.log(sql);
    db.con.query(sql, controllerCallback);
};
