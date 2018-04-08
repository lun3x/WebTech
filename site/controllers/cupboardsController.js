// cupboardsController.js

const db = require('../models/cupboardModel.js');

exports.getUserCupboard = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send("Error! Not logged in.");
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    db.returnCupboard(req.session.user_id, (err, dbResult) => {
        if (err) {
            res.status(500).send("Oops, something broke!");
            return;
        }
        res.status(200).json({
            user_id: req.session.user_id,
            data: {
                cupboard: {
                    food: dbResult
                }
            }
        });
    });
};

exports.removeFood = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send("Error! Not logged in.");
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    db.deleteIngredientCupboard(req.params.ingredient_id, req.session.user_id, (err) => {
        if (err) {
            res.status(404).send('Error! Couldn`t find ingredient to delete from cupboard');
            return;
        }
        res.status(200).send('Success! Deleted ingredient from cupboard');
        return;
    });
};

exports.addFood = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send("Error! Not logged in.");
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    db.getCupboard(req.params.cupboard_id, (err, dbResult) => {
        if (err) {
            res.status(500).send("Oops, something broke!");
            return;
        }
        if (dbResult.length == 1) {
            if (dbResult[0].user_id == req.session.user_id) {
                db.createIngredientCupboard(req.params.ingredient_id, req.params.cupboard_id, (err) => {
                    res.status(201).send('Success! Added ingredient to cupboard.');
                    return;
                });
            } else {
                res.status(403).send('Error! Not authorised to add to this cupboard.');
                return;
            }
        } else {
            res.status(404).send('Error! Could not find cupboard to add ingredient to.');
            return;
        }
    });
};
