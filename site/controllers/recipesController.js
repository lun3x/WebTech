// recipesController.js

const db = require('../models/recipeModel.js');
const path = require('path');
const fs = require('fs');

exports.allRecipes = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    db.getAllRecipes((err, dbResult) => {
        if (err) res.status(500).send('Error! Couldn\'t get ingredients.');
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                data: {
                    recipes: dbResult
                }
            });
        }
    });
};

exports.findRecipes = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    console.dir(req.body);

    if (!(req.body && Array.isArray(req.body.ingredient_ids))) {
        res.status(422).send('Error! Correct format { ingredient_ids: [id::number] }');
        return;
    }

    // db.findRecipes(req.body.ingredients, (err, dbResult) => {
    //     if (err) res.status(500).send('Error! Failed to search for recipes.');
    //     else {
    //         res.setHeader('Content-Type', 'application/json');
    //         res.status(200).json({
    //             data: {
    //                 recipes: dbResult
    //             }
    //         });
    //     }
    // });

    // TODO: DO ACTUAL SQL QUERY, THIS IS JUST DUMMY DATA
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        data: {
            recipes: [
                {
                    id: 2,
                    name: 'Roast Salmon',
                    method: '1. Rub garlic into salmon.\n\
                             2. Place Salmon in baking tray with chopped peppers.\n\
                             3. Roast for 30 mins at 180 degrees in fan oven.',
                    ingredients: [
                        'Peppers', 'Garlic', 'Salmon'
                    ]
                },
                {
                    id: 3,
                    name: 'Caramelized Onions',
                    method: '1. Just put the onions in a pan on medium heat with oil.\n\
                             2. Keep stirring.\n\
                             3. Did you really need an app to tell you how to do this?',
                    ingredients: [
                        'Onion'
                    ]
                },
                {
                    id: 4,
                    name: 'Baked Potato',
                    method: '1. Pour cheese all over the potato.\n\
                             2. Roast in the oven until cheese is melted.',
                    ingredients: [
                        'Cheese', 'Potato'
                    ]
                },
            ]
        }
    });
};

exports.recipeImage = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
    }

    console.dir(req.params.id);

    if (!req.params.id) {
        res.status(422).send('Error! Must include recipe_id');
        return;
    }

    let img_path = path.join(__dirname, '../static/images/recipe_images', req.params.id + '.png');

    if (!fs.existsSync(img_path)) {
        res.status(422).send('Error! Image is not found');
        return;
    }

    // read img from file and convert to base64 encoded string
    let png = fs.readFileSync(img_path);
    let base64_img = Buffer.from(png).toString('base64');

    // write headers
    // res.writeHead(200, {
    //     'Content-Type': 'image/png',
    //     'Content-Length': base64_img.length,
    // });
    // res.status(200).end(base64_img); 
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(img_path);
};


