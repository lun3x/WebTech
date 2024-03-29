const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const db = require('../models/authModel.js');
const cupboardModel = require('../models/cupboardModel.js');

exports.isAuthenticated = (req, res) => {
    if (!req.session || !req.session.authenticated) res.json({ authenticated: false });
    else res.json({ authenticated: true });
};

exports.login = (req, res) => {
    db.getUser(req.body.username, (err, dbResult) => {
        if (dbResult.length === 1) {
            bcrypt.compare(req.body.password, dbResult[0].password, (err2, compResult) => {
                if (compResult) {
                    console.log('AUTHENTICATED');
                    req.session.authenticated = true;
                    req.session.user_id = dbResult[0].id;
                    req.session.cupboard_id = dbResult[0].default_cupboard_id;
                    res.status(200).send('Authenticated');
                }
                else {
                    console.log('NOT AUTHENTICATED - PASSWORD INCORRECT');
                    res.status(401).send('Not Authenticated');
                }
            });   
        }
        else {
            console.log('NOT AUTHENTICATED - USER DOESN`T EXIST');
            res.status(401).send('Not Authenticated');
        }
    });
};

exports.logout = (req, res) => {
    delete req.session.authenticated;
    delete req.session.user_id;
    res.status(200).json({ });
    //res.redirect('/');
};

exports.changeUsername = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    if (!/^[\x00-\x7F]*$/.test(req.body.username)) {
        res.status(422).send('Error! Username does not meet requirements.');
        return;
    }

    db.changeUsername(req.session.user_id, req.body.username, (err) => {
        if (err) res.status(409).send('Error! Username taken');
        else res.status(200).send('Success! Changed username');
    });
};

exports.changePassword = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    if (!/^[\x00-\xFF]*$/.test(req.body.password)) {
        res.status(422).send('Error! Password does not meet requirements.');
        return;
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) res.status(500).json({ fail: 'hashFail' });
        else {
            db.changePassword(req.session.user_id, hash, (err2) => {
                if (err2) res.status(500).json({ fail: 'cannotChangePass' });
                else res.status(200).send('Success! Password changed.');
            });
        }
    });
};

exports.register = (req, res) => {
    // check username is ASCII and password is extended ASCII
    if (!/^[\x00-\x7F]*$/.test(req.body.username)) {
        res.status(422).json({ fail: 'usernameChar' });
        return;
    } 
    else if (!/^[\x00-\xFF]*$/.test(req.body.password)) {
        res.status(422).json({ fail: 'passwordChar' });
        return;
    }

    // set username to lowercase
    req.body.username = req.body.username.toLowerCase();

    // hash plain text password
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) res.status(500).json({ fail: 'hashFail' });
        else {
            // create user with hashed password
            db.createUser(req.body.name, hash, req.body.username, (err2, result) => {
                if (err2) res.status(409).json({ fail: 'usernameTaken' }); 
                else {
                    // get id of newly created user
                    let user_id = result.insertId;
                    // create cupboard linked to new user
                    cupboardModel.createCupboard(user_id, (err3, result2) => {
                        if (err3) {
                            res.status(500).json({ fail: 'cannotCreateCupboard' });
                            db.deleteUser(user_id, (err3b) => {
                                if (err3b) console.log('User account rollback failed - database may be in damaged state!');
                            });
                        }
                        else {
                            // get id of newly created cupboard
                            let cupboard_id = result2.insertId;
                            
                            // update default cupboard of new user
                            db.updateDefaultCupboard(cupboard_id, user_id, (err4) => {
                                if (err4) {
                                    res.status(500).json({ fail: 'cannotUpdateDefaultCupboard' });
                                    cupboardModel.deleteCupboard(cupboard_id, (err4b) => {
                                        if (err4b) console.log('Cupboard rollback failed - database may be in damaged state!');
                                        else {
                                            db.deleteUser(user_id, (err4c) => {
                                                if (err4c) console.log('User account rollback failed after cupboard rollback - database may be in damaged state!');
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(201).json({ fail: 'none' });
                                    
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
