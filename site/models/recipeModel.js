const mysql = require('mysql');
const db = require('../database.js');

// Gets all food from db and returns result to page as JSON
exports.getAllRecipes = (controllerCallback) => {
    let sql = 'SELECT * FROM Recipes;';

    console.log(sql);
    db.con.query(sql, controllerCallback);
};

exports.findRecipes = (ingredient_ids, controllerCallback) => {
    let reducer = (acc, current) => (acc + ` UNION SELECT ${current}`);
    let subsql = 'SELECT ' + ingredient_ids.reduce(reducer);
    // TODO: use ??? syntax to avoid injection attacks
    // TODO: the front end sends ingredientcupboard_ids, not ingredient_ids. need to fix the sql now :(

    let sql = `SELECT *\
           FROM (\
               SELECT recipes.id\
               FROM recipes\
               WHERE id NOT IN (\
                   SELECT recipes.id AS id\
                   FROM recipes LEFT OUTER JOIN RecipeIngredients ON recipes.id = RecipeIngredients.recipe_id\
                   WHERE ingredient_id not in (\
                       SELECT ic.ingredient_id FROM IngredientCupboards AS ic WHERE ic.id IN (${subsql})\
                    )\
                )\
           ) AS rs LEFT OUTER JOIN RecipeIngredients ON rs.id = RecipeIngredients.recipe_id\
           LEFT OUTER JOIN Ingredients ON RecipeIngredients.ingredient_id = Ingredients.id`;

    console.log(sql);

    db.con.query(sql, controllerCallback);
};
