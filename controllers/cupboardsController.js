// cupboardsController.js

const db = require('../models/cupboardModel.js');

exports.getUserCupboard = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    db.getCupboardIngredients(req.session.cupboard_id, (err, dbResult) => {
        if (err) res.status(500).send('Oops, something broke!');
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                user_id: req.session.user_id,
                data: {
                    cupboard: {
                        food: dbResult
                    }
                }
            });
        }
    });
};

exports.removeFood = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    db.getCupboard(req.session.cupboard_id, (err, dbResult) => {
        if (err) res.status(500).send('Error! Failed to get cupboard.');
        else if (dbResult.length === 1) {
            if (dbResult[0].user_id === req.session.user_id) {
                db.deleteIngredientCupboard(req.params.ingredient_id, (err2) => {
                    if (err2) res.status(500).send('Error! Couldn`t delete ingredient from cupboard.');
                    res.status(200).send('Success! Deleted ingredient from cupboard.');
                });
            }
            else {
                res.status(403).send('Error! Not authorised to delete from this cupboard.');
            }
        }
        else {
            res.status(404).send('Error! Could not find cupboard to remove ingredient from.');
        }
    });
};

exports.addFood = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    db.getCupboard(req.session.cupboard_id, (err, dbResult) => {
        if (err) res.status(500).send('Error! Failed to get cupboard.');
        else if (dbResult.length === 1) {
            if (dbResult[0].user_id === req.session.user_id) {
                db.createIngredientCupboard(req.params.ingredient_id, req.session.cupboard_id, (err2) => {
                    if (err2) res.status(500).send('Error! Couldn`t add ingredient to cupboard');
                    else      res.status(201).send('Success! Added ingredient to cupboard.');
                });
            }
            else {
                res.status(403).send('Error! Not authorised to add to this cupboard.');
            }
        }
        else {
            console.log('Error adding food cant find cupboard');
            res.status(404).send('Error! Could not find cupboard to add ingredient to.');
        }
    });
};

exports.addCupboard = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    db.createCupboard(req.session.user_id, (err) => {
        if (err) res.status(500).send('Error! Couldn`t add new cupboard.');
        else     res.status(201).send('Success! Created new cupboard.');
    }); 
};
