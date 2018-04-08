// ingredientsController.js

const db = require('../models/ingredientsModel.js');

// A list of all ingredients
exports.allIngredients = (req, res) => {
    // set Content-Type header
    res.setHeader('Content-Type', 'application/json');

    db.returnIngredients((err, dbResult) => {
        if (err) res.status(500).send('Error! Couldn`t get ingredients.');
        else {
            res.json({
                data: {
                    ingredients: dbResult
                }
            });
        }
    });
};
