// Sample express web server.  Supports the same features as the provided server,
// and demonstrates a big potential security loophole in express.

const express = require('express');

const app = express();

const path = require('path');
const bcrypt = require('bcrypt');
const redis   = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

//=== Setup Db Connections ===//
const redisClient = redis.createClient(process.env.REDIS_URL);

//=== Ban uppercase letters in static files ===//
let banned = [];
banUpperCase('./static/', ''); // eslint-disable-line no-use-before-define


//=== db ===//
let db = require('./database.js');


//=== Routes ===//
let auth = require('./routes/auth');
let api = require('./routes/api');
let test = require('./routes/test');
let ajax = require('./routes/ajax');


//=== Middleware functions ===//

// Error handler
function error(req, res) {
    if (req.url.length > 0) {
        res.status(404).send('404 Error! Page not found.');
    }
}

// Make the URL lower case.
function lower(req, res, next) {
    req.url = req.url.toLowerCase();
    next();
}

// Forbid access to the URLs in the banned list.
// And enforce URLs contain protocol at the start
function ban(req, res, next) {
    // ensure we don't serve banned resource
    for (let i = 0; i < banned.length; i++) {
        let b = banned[i];
        if (req.url.startsWith(b)) {
            res.status(404).send('Filename not lower case');
            return;
        }
    }

    // ensure valid protocol
    if (!(req.protocol.toString().startsWith('http') || req.protocol.toString().startsWith('https'))) {
        res.status(400).send('Must include protocol with URL.');
        return;
    }

    next();
}

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, _path, _stat) {
    if (_path.endsWith('.html')) {
        res.header('Content-Type', 'application/xhtml+xml');
    }
}

// negotiate content
function negotiate(req, res, next) {
    if (req.path === '/') {
        if (req.accepts('application/xhtml+xml')) {
            res.header('Content-Type', 'application/xhtml+xml');
            next();
        }
        else if (req.accepts('html') || req.accepts('text/html')) {
            res.header('Content-Type', 'text/html');
            next();
        }
        else {
            res.status(406).send('Not acceptable content type. Html/xhtml for root path only.');
        }
    }
    else {
        next();
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
        if (name != name.toLowerCase()) {
            banned.push(file.toLowerCase());
            process.stdout.write(`banned file. ${name}\n`);
        }
        let mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}

function enforceHTTPS(req, res, next) {
    // If we are in production on heroku check the header
    if (app.get('env') !== 'development') {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        }
        else {
            next();
        }
    }
    // else check req.secure
    else if (!req.secure) {
        let urlArray = req.headers.host.split(':');
        res.redirect(`https://${urlArray[0]}:5000${req.url}`);
    }
    else {
        next();
    }
}

function favicon(req, res, next) {
    if (req.url === '/favicon.ico') {
        res.sendFile(path.join(__dirname, 'static/images/logo.ico'));
    }
    else {
        next();
    }
}

//=== Middleware Chain ===//

// enforce HTTPS use
app.use(enforceHTTPS);

// helmet (set common headers to avoid security vulnerabilites)
app.use(helmet());

// serve favicon, before logger to avoid unnecessary logging
app.use(favicon);

// logger
app.use(logger('combined'));

// ensure everything is lowercase
app.use(lower);

// enforce banned urls
app.use(ban);

// parse req body's
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    },
    store: new RedisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient
    })
}));

// compress responses, if supported by client
app.use(compression());

// user login
app.use('/auth', auth);
app.use('/api', api);

// content negotiation (html vs xhtml)
app.use(negotiate);

// serve frontend
//let options = { setHeaders: deliverXHTML };
app.use(express.static(path.join(__dirname, 'frontend/dist')));//, options)); 

// catch 404 and forward to error handler
app.use('/', error);

// home page
app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/dist/index.html'));
});

//=== Export the set up app ===//
module.exports = app;
