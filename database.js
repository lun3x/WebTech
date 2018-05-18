const mysql = require('mysql');


// Use a pool
// exports.con = mysql.createPool({
//     connectionLimit: 100,
//     host: process.env.JAWSDB_URL || 'localhost',
//     user: 'root',
//     password: 'pass',
//     database: 'mydb2',
// });



let connection;

if (process.env.JAWSDB_URL) {
    //Heroku deployment
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
    //local host
    connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'mydb2',
    });
}

exports.con = connection;
