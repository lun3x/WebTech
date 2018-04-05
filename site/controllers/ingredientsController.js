// ingredientsController.js


// A list of all ingredients
exports.all_ingredients = (req, res) => {
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
};


