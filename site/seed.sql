INSERT INTO Ingredients (name) VALUES ('Tomato');
INSERT INTO Ingredients (name) VALUES ('Cheese');
INSERT INTO Ingredients (name) VALUES ('Potato');
INSERT INTO Ingredients (name) VALUES ('Onion');
INSERT INTO Ingredients (name) VALUES ('Peppers');
INSERT INTO Ingredients (name) VALUES ('Flour');
INSERT INTO Ingredients (name) VALUES ('Chocolate');
INSERT INTO Ingredients (name) VALUES ('Tumeric');
INSERT INTO Ingredients (name) VALUES ('Kidney Beans');
INSERT INTO Ingredients (name) VALUES ('Garlic');
INSERT INTO Ingredients (name) VALUES ('Salmon');
INSERT INTO Ingredients (name) VALUES ('Lamb');

INSERT INTO Users (name, password, username, default_cupboard_id) VALUES ('Louis', 'pass', 'louisw', NULL);
INSERT INTO Users (name, password, username, default_cupboard_id) VALUES ('Ahmer', 'pass', 'ahmerb', NULL);

INSERT INTO Cupboards (user_id) VALUES (1);
INSERT INTO Cupboards (user_id) VALUES (2);

INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (1, 1);
INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (3, 1);

INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (2, 2);
INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (4, 2);

INSERT INTO Recipes (name, method) VALUES ('Roast Salmon', '1. Rub garlic into salmon.\n2. Place Salmon in baking tray with chopped peppers.\n3. Roast for 30 mins for 180 degrees in fan oven.');
INSERT INTO RecipeIngredients (ingredient_id, recipe_id) VALUES (11, 1);
INSERT INTO RecipeIngredients (ingredient_id, recipe_id) VALUES (10, 1);
INSERT INTO RecipeIngredients (ingredient_id, recipe_id) VALUES (5 , 1);

INSERT INTO Recipes (name, method) VALUES ('Fried Onions', '1. Just put the onions in a pan on medium heat with oil.\n 2. Keep stirring.\n 3. Did you really need an app to tell you how to do this?');
INSERT INTO RecipeIngredients (ingredient_id, recipe_id) VALUES (4, 2);

INSERT INTO Recipes (name, method) VALUES ('Baked Potato', '1. Pour cheese all over the potato.\n2. Roast in the over until cheese is melted.');
INSERT INTO RecipeIngredients (ingredient_id, recipe_id) VALUES (2, 3);
INSERT INTO RecipeIngredients (ingredient_id, recipe_id) VALUES (2, 3);
