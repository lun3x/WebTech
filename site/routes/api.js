const express = require('express');

const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');
const cupboardsController   = require('../controllers/cupboardsController');

/* GET all ingredients. */
router.get('/ingredients', ingredientsController.allIngredients);


/* GET the cupboard for user `user_id`. */
router.get('/cupboards/add/:foodID/:cupboardID', cupboardsController.addFood);
router.get('/cupboards/remove/:foodID', cupboardsController.removeFood);
router.get('/cupboards/user/:user_id', cupboardsController.getUserCupboard);


module.exports = router;
