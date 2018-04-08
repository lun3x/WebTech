const express = require('express');

const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');
const cupboardsController   = require('../controllers/cupboardsController');

/* GET all ingredients. */
router.get('/ingredients', ingredientsController.allIngredients);

/* DELETE ingredient from current working cupboard */
router.delete('/cupboard/remove/:ingredient_id', cupboardsController.removeFood);
router.get('/cupboard/ingredients', cupboardsController.getUserCupboard);

/* PUT add food to user's cupboard */
router.put('/cupboard/add/:ingredient_id', cupboardsController.addFood);


module.exports = router;
