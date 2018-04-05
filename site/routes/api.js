const express = require('express');

const router = express.Router();

const ingredientsController = require('../controllers/ingredientsController');
const cupboardsController   = require('../controllers/cupboardsController');

/* GET all ingredients. */
router.get('/ingredients', ingredientsController.all_ingredients);


/* GET the cupboard for user `user_id`. */
router.get('/cupboards/:user_id', cupboardsController.get_user_cupboard);


module.exports = router;
