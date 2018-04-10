// recipesController.js

const db = require('../models/recipeModel.js');

exports.allRecipes = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    db.getAllRecipes((err, dbResult) => {
        if (err) res.status(500).send('Error! Couldn`t get ingredients.');
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                data: {
                    recipes: dbResult
                }
            });
        }
    });
};

