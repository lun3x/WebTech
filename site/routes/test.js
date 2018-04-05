var express = require('express');
var router = express.Router();

// GET test.html
router.get('/', function(req, res, next) {
    res.redirect('/test.html');
});

// GET test throwing an error
router.get('/err', function(req, res, next) {
    throw new Error('oopsie');
});

module.exports = router;
