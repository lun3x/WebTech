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

router.get('/logout', function (req, res) {
	delete req.session.authenticated;
	res.redirect('/');
});

module.exports = router;
