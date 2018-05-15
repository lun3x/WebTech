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
