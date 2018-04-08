let express = require('express');

let router = express.Router();

// GET test.html
router.get('/', (req, res, next) => {
    res.redirect('/test.html');
});

// GET test throwing an error
router.get('/err', (req, res, next) => {
    throw new Error('oopsie');
});

module.exports = router;
