const express = require('express');

const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');
const cupboardsController   = require('../controllers/cupboardsController');

/* GET all ingredients. */
router.get('/ingredients', ingredientsController.allIngredients);


/* GET the cupboard for user `user_id`. */
router.get('/cupboards/remove/:foodID', cupboardsController.removeFood);
router.get('/cupboards/user/:user_id', cupboardsController.getUserCupboard);

/* PUT add food to user's cupboard */
router.put('/cupboards/:cupboardID/add/:foodID', cupboardsController.addFood);


module.exports = router;
