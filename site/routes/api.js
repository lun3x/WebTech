const express = require('express');

const router = express.Router();

/* GET all ingredients. */
router.get('/ingredients', (req, res, next) => {
    // set Content-Type header
    res.setHeader('Content-Type', 'application/json');

    // response is the list of all ingredients
    let data = {
        ingredients: [
            'onion',
            'cabbage',
            'lamb',
            'chicken',
            'eggs',
            'wine',
            'vodka',
            'celery'
        ]
    };

    // send the response
    res.send(JSON.stringify({ data }));
});

/* GET the cupboard for user `user_id`. */
router.get('/cupboards/:user_id', (req, res, next) => {
    let user_id = req.params.user_id;

});

/* GET cool */
router.get('/cool', (req, res, next) => {
    res.send('you are so cool.');
});

module.exports = router;
