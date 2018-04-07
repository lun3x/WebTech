const express = require('express');
const router = express.Router();

const db = require('../database.js');

// GET login page
router.get('/', (req, res) => {
    if (!req.session || !req.session.authenticated) {
		res.redirect('/login');
		return;
	}
});

router.get('/login', (req, res) => {
	res.send('/login.html');
});

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    db.authenticate(username, password, req, res);
});

app.get('/logout', function (req, res) {
	delete req.session.authenticated;
	res.redirect('/');
});

module.exports = router;
