const express = require('express');

const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');
const cupboardsController   = require('../controllers/cupboardsController');

/* GET all ingredients. */
router.get('/ingredients', ingredientsController.allIngredients);


/* GET the cupboard for user `user_id`. */
router.post('/cupboards/:cupboard_id/add/:ingredient_id', cupboardsController.addFood);
router.delete('/cupboards/remove/:ingredient_id', cupboardsController.removeFood);
router.get('/cupboard', cupboardsController.getUserCupboard);

/* PUT add food to user's cupboard */
router.put('/cupboards/:cupboardID/add/:foodID', cupboardsController.addFood);


module.exports = router;
