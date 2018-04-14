const express = require('express');

const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');
const cupboardsController   = require('../controllers/cupboardsController');
const recipesController   = require('../controllers/recipesController');


/*
 * IngredientsController
 */

/* GET all ingredients */
router.get('/ingredients', ingredientsController.allIngredients);


/*
 * CupboardsController
 */

/* GET recipes in logged in user's cupboard */
router.get('/cupboard/ingredients', cupboardsController.getUserCupboard);

/* DELETE ingredient from current working cupboard */
router.delete('/cupboard/remove/:ingredient_id', cupboardsController.removeFood);

/* PUT add food to user's cupboard */
router.put('/cupboard/add/:ingredient_id', cupboardsController.addFood);

/* POST create new cupboard */
router.post('/cupboard/create', cupboardsController.addCupboard);


/*
 * RecipesController
 */

/* GET all recipes */
router.get('/recipes/all', recipesController.allRecipes);

/* GET image for recipe */
router.get('/recipes/image/:id', recipesController.recipeImage);

/* PUT find recipes which use the ingredients specified (by id) in req body */
router.put('/recipes/find', recipesController.findRecipes); 


module.exports = router;
