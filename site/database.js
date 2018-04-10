const mysql = require('mysql');


// Use a pool
exports.con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'mydb2',
});
