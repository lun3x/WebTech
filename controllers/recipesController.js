// recipesController.js

const db = require('../models/recipeModel.js');
const voteModel = require('../models/voteModel.js');
const path = require('path');
const fs = require('fs');

exports.allRecipes = (req, res) => {
    db.getAllRecipes((err, dbResult) => {
        if (err) res.status(500).send('Error! Couldn\'t get recipes.');
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

exports.createRecipe = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    if (!(req.body && req.body.recipe && req.body.recipe.name && req.body.recipe.method && Array.isArray(req.body.recipe.ingredient_ids) && req.body.recipe.ingredient_ids.length > 0)) {
        res.status(422).send('Error! Correct format { ingredient_ids: [id::number] }');
        return;
    }

    db.createRecipe(req.body.recipe.name, req.body.recipe.method, (err, newRecipe) => {
        if (err) res.status(500).send('Error! Couldn`t create recipe.');
        else {
            db.addIngredientsToRecipe(newRecipe.insertId, req.body.recipe.ingredient_ids, (err2) => {
                if (err2) res.status(500).send('Error! Couldn`t add ingredients to recipe.');
                else {
                    res.status(200).send('Success! Added new recipe.');
                }
            });
        }
    });
};

exports.findIngredientsOfRecipe = (req, res) => {
    db.findIngredientsOfRecipe(req.params.id, (err, dbResult) => {
        if (err) res.status(500).send('Error! Failed to find ingredients for recipe.');
        else {
            let ingredients = [];
            for (let i = 0; i < dbResult.length; i++) {
                ingredients.push(dbResult[i]);
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                data: {
                    ingredients
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

    if (!(req.body && Array.isArray(req.body.ingredient_ids) && req.body.ingredient_ids.length >= 0)) {
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

            let usable_recipes = [];
            let current_ingredients = [];
            let current_recipe_id = dbResult[0].recipe_id;

            for (let i = 0; i < dbResult.length; i++) {
                if (dbResult[i].recipe_id !== current_recipe_id) {
                    //CHECK RECIPE USABLE
                    if (current_ingredients.every(val => req.body.ingredient_ids.indexOf(val) >= 0)) {
                        usable_recipes.push(dbResult[i - 1].recipe_id);
                    }

                    current_recipe_id = dbResult[i].recipe_id;
                    current_ingredients = [];
                }
                
                current_ingredients.push(dbResult[i].ingredient_id);
            }
            
            // CHECK FINAL RECIPE USABLE
            if (current_ingredients.every(val => req.body.ingredient_ids.indexOf(val) >= 0)) {
                usable_recipes.push(dbResult[dbResult.length - 1].recipe_id);
            }

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
        return;
    }

    if (!req.params.id) {
        res.status(422).send('Error! Must include recipe_id');
        return;
    }

    //=== Loop around through default images ===//
    req.params.id %= 4;
    //=======//

    let img_path = path.join(__dirname, '../static/images/recipe_images/', req.params.id + '.png');

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

exports.upvoteRecipe = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    voteModel.getVote(req.params.id, req.session.user_id, (err, result) => {
        if (err) res.status(500).send('Error! Failed to get vote status.');
        else if (result.length === 0) {
            voteModel.createVote(req.params.id, req.session.user_id, true, (err2) => {
                if (err2) res.status(500).send('Error! Failed to create upvote.');
                else {
                    db.updateRecipeScore(req.params.id, 1, (err3) => {
                        if (err3) res.status(500).send('Error! Failed to update recipe score.');
                        else {
                            res.status(200).json({
                                upvoted: true,
                                downvoted: false
                            });
                        }
                    });
                }
            });
        }
        else if (result[0].upvote) {
            voteModel.deleteVote(req.params.id, req.session.user_id, (err2) => {
                if (err2) res.status(500).send('Error! Failed to delete upvote.');
                else {
                    db.updateRecipeScore(req.params.id, -1, (err3) => {
                        if (err3) res.status(500).send('Error! Failed to update recipe score.');
                        else {
                            res.status(200).json({
                                upvoted: false,
                                downvoted: false
                            });
                        }
                    });
                }
            });
        }
        else if (!result[0].upvote) {
            voteModel.updateVote(req.params.id, req.session.user_id, true, (err2) => {
                if (err2) res.status(500).send('Error! Failed to change vote.');
                else {
                    db.updateRecipeScore(req.params.id, 2, (err3) => {
                        if (err3) res.status(500).send('Error! Failed to update recipe.');
                        else {
                            res.status(200).json({
                                upvoted: true,
                                downvoted: false,
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.downVoteRecipe = (req, res) => {
    if (!req.session || !req.session.authenticated) {
        res.status(401).send('Error! Not logged in.');
        return;
    }

    voteModel.getVote(req.params.id, req.session.user_id, (err, result) => {
        if (err) res.status(500).send('Error! Failed to get vote status.');
        else if (result.length === 0) {
            voteModel.createVote(req.params.id, req.session.user_id, false, (err2) => {
                if (err2) res.status(500).send('Error! Failed to create downvote.');
                else {
                    db.updateRecipeScore(req.params.id, -1, (err3) => {
                        if (err3) res.status(500).send('Error! Failed to update score.');
                        else {
                            res.status(200).json({
                                upvoted: false,
                                downvoted: true
                            });
                        }
                    });
                }
            });
        }
        else if (!result[0].upvote) {
            voteModel.deleteVote(req.params.id, req.session.user_id, (err2) => {
                if (err2) res.status(500).send('Error! Failed to delete downvote.');
                else {
                    db.updateRecipeScore(req.params.id, 1, (err3) => {
                        if (err3) res.status(500).send('Error! Failed to update score.');
                        else {
                            res.status(200).json({
                                upvoted: false,
                                downvoted: false
                            });
                        }
                    });
                }
            });
        }
        else if (result[0].upvote) {
            voteModel.updateVote(req.params.id, req.session.user_id, false, (err2) => {
                if (err2) res.status(500).send('Error! Failed to change vote.');
                else {
                    db.updateRecipeScore(req.params.id, -2, (err3) => {
                        if (err3) res.status(500).send('Error! Failed to update score.');
                        else {
                            res.status(200).json({
                                upvoted: false,
                                downvoted: true,
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.getVoteStatus = (req, res) => {
    db.getRecipe(req.params.id, (err, results) => {
        if (err) res.status(500).send('Error! Coudln\'t get recipe to count votes.');
        else if (results.length === 1) {
            let score = results[0].score;

            voteModel.getVote(req.params.id, req.session.user_id, (err2, result2) => {
                if (err2) res.status(500).send('Error! Couldn\'t get vote status');
                else if (result2.length === 1) {
                    res.status(200).json({
                        votes: score,
                        upvoted: result2[0].upvote,
                        downvoted: !result2[0].upvote
                    });
                }
                else {
                    res.status(200).json({
                        votes: score,
                        upvoted: false,
                        downvoted: false
                    });
                }
            });
        }
        else {
            res.status(404).send('Error! Recipe not found.');
        }
    });
};
