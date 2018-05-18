const mysql = require('mysql');


// Use a pool
exports.con = mysql.createPool({
    connectionLimit: 100,
    host: process.env.JAWSDB_URL || 'localhost',
    user: 'root',
    password: 'pass',
    database: 'mydb2',
});

