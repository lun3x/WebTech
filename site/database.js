const mysql = require('mysql');

exports.con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'mydb2',
});
