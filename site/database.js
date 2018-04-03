var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "321mowgli123"
});

function onDbCon(err, res) {
    if (err) throw err;
    console.log("Database created");
}

function dbCon(err) {
    if (err) throw err;
    console.log("Connected!");
    
    con.query("CREATE DATABASE mydb", onDbCon);
}

con.connect(dbCon);


