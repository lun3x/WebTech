const express = require('express');
const router = express.Router();

const db = require('../database.js');

exports.isAuthenticated = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.json({
            authenticated: false
        });
    } else {
        res.json({
            authenticated: true
        });
    }
};

exports.login = (req, res) => {
    db.authenticate(req, res);
};

exports.logout = (req, res) => {
    delete req.session.authenticated;
    delete req.session.user_id;
	res.redirect('/');
};

exports.register = (req, res) => {
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

    db.createUser(req, res);
};
