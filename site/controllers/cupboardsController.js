// cupboardsController.js

const db = require('../database.js');
const auth = require('../routes/auth.js');

exports.getUserCupboard = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    db.returnCupboard(req.session.user_id, res);
};

exports.removeFood = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    db.removeFood(req, res);
};

exports.addFood = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    db.addFood(req, res);
};
