const express = require('express');
var bcrypt = require('bcrypt');

const router = express.Router();

const db = require('../models/authModel.js');
const cupboardModel = require('../models/cupboardModel.js');

exports.isAuthenticated = (req, res) => {
    if (!req.session || !req.session.authenticated) res.json({ authenticated: false });
    else res.json({ authenticated: true });
};

// TODO: cupoard_id on login
exports.login = (req, res) => {
    db.getUser(req.body.username, (err, dbResult) => {
        if (dbResult.length === 1) {
            bcrypt.compare(req.body.password, dbResult[0].password, (err, compResult) => {
                if (compResult) {
                    console.log('AUTHENTICATED');
                    req.session.authenticated = true;
                    req.session.user_id = dbResult[0].id;
                    res.status(200).send('Authenticated');
                } else {
                    console.log('NOT AUTHENTICATED - PASSWORD INCORRECT');
                    res.status(401).send('Not Authenticated');
                }
            });   
        } else {
            console.log('NOT AUTHENTICATED - USER DOESN`T EXIST');
            res.status(401).send('Not Authenticated');
        }
    });
};

exports.logout = (req, res) => {
    delete req.session.authenticated;
    delete req.session.user_id;
	res.redirect('/');
};

exports.register = (req, res) => {
    // Check username is ASCII and password is extended ASCII
    if (!/^[\x00-\x7F]*$/.test(req.body.username)) {
        res.status(401).json({ fail: 'usernameChar' });
        return;
    } 
    else if (!/^[\x00-\xFF]*$/.test(req.body.password)) {
        res.status(401).json({ fail: 'passwordChar' });
        return;
    }

    // Set username to lowercase
    req.body.username = req.body.username.toLowerCase();

    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            res.status(500).json({ fail: 'hashFail' });
            return;
        }
        db.createUser(req.body.name, hash, req.body.username, (err, result) => {
            if (err) res.status(409).json({ fail: 'usernameTaken' }); 
            else {

                // now create a cupboard for this user
                cupboardModel.createCupboard(result.insertId, (err, result) => {
                    if (err) res.status(500).json({ fail: 'cannotCreateCupboard' });

                    let cupboardId = result.insertId;
                    req.session.cupboardId = cupboardId;
                    res.status(201).json({ fail: 'none' });
                });
            }
        });
    });
};
