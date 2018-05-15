const mysql = require('mysql');


// Use a pool
exports.con = mysql.createPool(process.env.JAWSDB_URL);
