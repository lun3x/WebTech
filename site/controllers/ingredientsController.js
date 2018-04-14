// ingredientsController.js

const db = require('../models/ingredientsModel.js');

// A list of all ingredients
exports.allIngredients = (req, res) => {
    db.returnIngredients((err, dbResult) => {
        if (err) res.status(500).send('Error! Couldn`t get ingredients.');
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                data: {
                    ingredients: dbResult
                }
            });
        }
    });
};
