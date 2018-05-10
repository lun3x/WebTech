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

    if (!(req.body && Array.isArray(req.body.ingredient_ids) && req.body.ingredient_ids.length > 0)) {
        res.status(422).send('Error! Correct format { ingredient_ids: [id::number] }');
        return;
    }

    db.findRecipeIngredients(req.body.ingredient_ids, (err, dbResult) => {
        if (err) res.status(500).send('Error! Failed to search for recipes.');
        else {
            if (dbResult.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({
                    data: {
                        recipes: []
                    }
                });
                return;
            }

            // Sort by recipe ids
            dbResult.sort((a, b) => a.recipe_id - b.recipe_id);

            console.dir(dbResult);

            let usable_recipes = [];
            let current_ingredients = [];
            let current_recipe_id = dbResult[0].recipe_id;

            console.dir(current_recipe_id);

            for (let i = 0; i < dbResult.length; i++) {
                if (dbResult[i].recipe_id !== current_recipe_id) {
                    console.log('NEXT RECIPE');
                    //CHECK RECIPE USABLE
                    if (current_ingredients.every(val => req.body.ingredient_ids.indexOf(val) >= 0)) {
                        console.log('ADDED RECIPE 1');
                        usable_recipes.push(dbResult[i - 1].recipe_id);
                    }

                    current_recipe_id = dbResult[i].recipe_id;
                    current_ingredients = [];
                }
                
                current_ingredients.push(dbResult[i].ingredient_id);
            }
            
            console.dir(current_ingredients);

            // CHECK FINAL RECIPE USABLE
            if (current_ingredients.every(val => req.body.ingredient_ids.indexOf(val) >= 0)) {
                console.log('ADDED RECIPE 2');
                usable_recipes.push(dbResult[dbResult.length - 1].recipe_id);
            }

            console.dir(usable_recipes);

            if (usable_recipes.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({
                    data: {
                        recipes: []
                    }
                });
                return;
            }

            db.findRecipes(usable_recipes, (err2, dbResult2) => {
                if (err2) res.status(500).send('Error! Failed to search for usable recipes.');
                else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({
                        data: {
                            recipes: dbResult2
                        }
                    });
                }
            });
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


