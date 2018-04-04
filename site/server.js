// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.

var express = require("express");
var bodyParser = require('body-parser');
var db = require("./database.js");
var app = express();
var bcrypt = require("bcrypt");
var session = require("express-session")
var fs = require("fs");
var banned = [];
banUpperCase("./public/", "");

//var mysql = require('mysql');
//
//var con = mysql.createConnection({
//  host: "localhost",
//  user: "root",
//  password: "321mowgli123",
//  database: "mydb"
//});

// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.

//=== Middleware setup ===//
app.use(lower);
app.use(ban);
app.use("/admin.html", auth);
var options = { setHeaders: deliverXHTML };
app.use(express.static("public", options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(chance);
app.use(error);

//=== URL routing setup ===//
app.get("/test", test);
app.get("/testerr", testerr);
app.get("/ajax", ajaxGet);
app.post("/ajax", ajaxPost);

app.listen(8080, "localhost");
console.log("Visit http://localhost:8080/");

//=== URL handlers ===//

// Ajax handler to check what data is requested
function ajaxGet(req, res) {
    let action = req.query.action;
    console.log(action);
    if (action == 'getFood') {
        db.returnFood(res);
    }
}

function ajaxPost(req, res) {
    let action = req.body.action;
    console.log(action);
    if (action == 'addFood') {
        db.addFood(req, res);
    }
    else if (action == 'plusB' || action == 'minusB') {
        db.incrDecrFood(req, res);
    }
}

// Example URL handler, just displays chance attribute of request (inserted by middleware)
function test(req, res) {
    res.redirect("/test.html");
}

// Example page throwing error
function testerr(req, res) {
    throw new Error("oops");
}

//=== Middleware functions ===//

// Error handler
function error(err, req, res, next) {
    console.log(err);
    res.status(500).send('Something broke!');
}

// Example middleware, just inserts a new field into the request with a random num
function chance(req, res, next) {
    req.chance = Math.random();
    next();
}

// Make the URL lower case.
function lower(req, res, next) {
    req.url = req.url.toLowerCase();
    next();
}

// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send("Filename not lower case");
            return;
        }
    }
    next();
}

// Redirect the browser to the login page.
function auth(req, res, next) {
    res.redirect("/login.html");
}

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, path, stat) {
    if (path.endsWith(".html")) {
        res.header("Content-Type", "application/xhtml+xml");
    }
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}
