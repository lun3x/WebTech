// cupboardsController.js

const db = require('../database.js');

exports.getUserCupboard = (req, res) => {
    let user_id = req.params.user_id;

    res.setHeader('Content-Type', 'application/json');

    db.returnCupboard(user_id, res);
};

exports.removeFood = (req, res) => {
    let id = req.params.foodID;

    res.setHeader('Content-Type', 'application/json');

    db.removeFood(id, res);
};

exports.addFood = (req, res) => {
    let foodID = req.params.foodID;
    let cupboardID = req.params.cupboardID;

    res.setHeader('Content-Type', 'application/json');

    console.log('cupboards controller add food');

    db.addFood(foodID, cupboardID, res);
};
