const express = require('express');
const router = express.Router();

const db = require('../database.js');

router.get('/isAuthenticated', (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.json({
            authenticated: false
        });
    } else {
        res.json({
            authenticated: true
        });
    }
});

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    console.log(password);

    db.authenticate(username, password, req, res);
});

router.get('/logout', (req, res) => {
	delete req.session.authenticated;
	res.redirect('/');
});

router.post('/register', (req, res) => {
    // Check username is ASCII and password is extended ASCII
    if (!/^[\x00-\x7F]*$/.test(req.body.username)) {
        res.status(401).json({
            fail: 'usernameChar'
        });
        return;
    } 
    else if (!/^[\x00-\xFF]*$/.test(req.body.password)) {
        res.status(401).json({
            fail: 'passwordChar'
        });
        return;
    }

    // Set username to lowercase
    req.body.username = req.body.username.toLowerCase();

    db.registerUser(req, res);
});

module.exports = router;
