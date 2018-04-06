// ingredientsController.js

const db = require('../database.js');

// A list of all ingredients
exports.allIngredients = (req, res) => {
    // set Content-Type header
    res.setHeader('Content-Type', 'application/json');

    db.returnIngredients(res);
};
