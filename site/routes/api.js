const express = require('express');

const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');
const cupboardsController   = require('../controllers/cupboardsController');
const recipesController   = require('../controllers/recipesController');

/* GET */
router.get('/ingredients', ingredientsController.allIngredients);
router.get('/recipe/all', recipesController.allRecipes);
router.get('/cupboard/ingredients', cupboardsController.getUserCupboard);

/* DELETE ingredient from current working cupboard */
router.delete('/cupboard/remove/:ingredient_id', cupboardsController.removeFood);

/* PUT add food to user's cupboard */
router.put('/cupboard/add/:ingredient_id', cupboardsController.addFood);

/* POST create new cupboard */
router.post('/cupboard/create', cupboardsController.addCupboard);


module.exports = router;
