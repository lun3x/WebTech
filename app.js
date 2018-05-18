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
//const redisClient = redis.createClient();
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
function error(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {},
    });
    next();
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
        if (name != name.toLowerCase()) {
            banned.push(file.toLowerCase());
            process.stdout.write(`banned file. ${name}\n`);
        }
        let mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}


//=== Middleware Chain ===//

// helmet (set common headers to avoid security vulnerabilites)
app.use(helmet());

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

// serve frontend
let options = { setHeaders: deliverXHTML };
app.use(express.static(path.join(__dirname, 'frontend/dist'), options)); 

// home page
app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/dist/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(error);

//=== Export the set up app ===//
module.exports = app;
