// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.

const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');

//== Banned URLs ==//
let banned = [];
banUpperCase('./public/', ''); // eslint-disable-line no-use-before-define


//=== db ===//
let db = require('./database.js');


//=== Routes ===//
let auth = require('./routes/auth');
let api = require('./routes/api');
let test = require('./routes/test');
let ajax = require('./routes/ajax');


//=== Run the app ===//
app.listen(8080, 'localhost');
console.log('Visit http://localhost:8080/');


// *****  TODO: OLD LOGIN STUFF HERE ******
// ***** TODO: WRITE A NEW LOGIN
//app.get("/login", loginGet);
// app.post("/login", loginPost);
//=== Login ==//
// function loginGet(req, res) {
//     console.log("someone went to GET login path");
//     res.redirect("/login.html");
// }

// function loginPost(req, res) {
//     console.log("someone wants to POST login path");

//     // parse username and email
//     let username = req.body.username;
//     let password = req.body.password;

//     if (!req.session.views) req.session.views = 0;
//     req.session.views += 1;


//     // validate
//     //req.checkBody('username', 'Username is required').notEmpty();
//     //req.checkBody('password', 'Password is required').notEmpty();

//     // response
//     // const errors = req.validationErrors();
//     // if (errors) {
//     //     req.session.errors = errors;
//     //     res.redirect("/login.html");
//     // }
//     // else {
//     //     req.session.success = true;
//     //     res.redirect("/index.html");
//     // }
//     console.log(username, password);
//     res.send("you have viewed " + req.session.views + " times");
// }


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
    for (let i = 0; i < banned.length; i++) {
        let b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send('Filename not lower case');
            return;
        }
    }
    next();
}

// Redirect the browser to the login page.
// function auth(req, res, next) {
//     res.redirect("/login.html");
// }

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, _path, _stat) {
    if (_path.endsWith('.html')) {
        res.header('Content-Type', 'application/xhtml+xml');
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
    /* eslint eqeqeq: "off" */
    /* eslint no-continue: "off" */
    /* eslint prefer-template: "off" */
    /* eslint prefer-destructuring: "off" */
    let folderBit = 1 << 14;
    let names = fs.readdirSync(root + folder);
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let file = folder + '/' + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        let mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}


//=== Middleware setup ===//

// ensure everything is lowercase
app.use(lower);

// enforce banned urls
app.use(ban);

// user login
app.use('/auth', auth);

// serve static pages
let options = { setHeaders: deliverXHTML };
app.use(express.static(path.join(__dirname, 'public'), options));

// parse req body's
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// a middleware that doesn't do much (we made it for testing)
app.use(chance);

// other handlers
app.use('/api', api);
app.use('/test', test);
app.use('/ajax', ajax);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(error);
