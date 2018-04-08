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

    db.deleteIngredientCupboard(req.params.ingredient_id, req.session.user_id, (err) => {
        if (err) res.status(404).send('Error! Couldn`t find ingredient to delete from cupboard');
        else     res.status(200).send('Success! Deleted ingredient from cupboard'); 
    });
};

exports.addFood = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    db.getCupboard(req.session.cupboard_id, (err, dbResult) => {
        if (err) res.status(500).send('Oops, something broke!');
        else {
            if (dbResult.length === 1) {
                if (dbResult[0].user_id === req.session.user_id) {
                    db.createIngredientCupboard(req.params.ingredient_id, req.session.cupboard_id, (err2) => {
                        res.status(201).send('Success! Added ingredient to cupboard.');
                    });
                }
                else {
                    res.status(403).send('Error! Not authorised to add to this cupboard.');
                }
            }
            else {
                res.status(404).send('Error! Could not find cupboard to add ingredient to.');
            }
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
}
