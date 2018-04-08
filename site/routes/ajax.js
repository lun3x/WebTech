// DEPRECATED: this route is only here for compatability

let express = require('express');

let router = express.Router();

let db = require('../database');


// GET 
router.get('/', (req, res, next) => {
    let action = req.query.action;
    console.log(action);
    if (action === 'getFood') {
        db.returnFood(res);
    }
});

// POST
router.post('/', (req, res, next) => {
    let action = req.body.action;
    console.log(action);
    if (action === 'addFood') {
        db.addFood(req, res);
    }
    else if (action === 'plusB' || action === 'minusB') {
        db.incrDecrFood(req, res);
    }
});


module.exports = router;
