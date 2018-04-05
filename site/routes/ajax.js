// DEPRECATED: this route is only here for compatability

var express = require('express');
var router = express.Router();

var db = require('../database');


// GET 
router.get('/', function(req, res, next) {
    let action = req.query.action;
    console.log(action);
    if (action == 'getFood') {
        db.returnFood(res);
    }
});

// POST
router.post('/', function(req, res, next) {
    let action = req.body.action;
    console.log(action);
    if (action == 'addFood') {
        db.addFood(req, res);
    }
    else if (action == 'plusB' || action == 'minusB') {
        db.incrDecrFood(req, res);
    }
});


module.exports = router;