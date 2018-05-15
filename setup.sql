CREATE TABLE Users(id       int          NOT NULL AUTO_INCREMENT,
                   name     varchar(255),
                   password varchar(255),
                   username varchar(255) UNIQUE,
                   PRIMARY KEY (id)
);

CREATE TABLE Cupboards(id      int NOT NULL AUTO_INCREMENT,
                       user_id int NOT NULL,
                       PRIMARY KEY (id),
                       CONSTRAINT FK_CupboardUser FOREIGN KEY (user_id) REFERENCES Users(id)
);

ALTER TABLE Users ADD COLUMN default_cupboard_id int NULL;
ALTER TABLE Users ADD CONSTRAINT FK_DefaultCupboard FOREIGN KEY (default_cupboard_id) REFERENCES Cupboards(id);

CREATE TABLE Ingredients(id  int          NOT NULL AUTO_INCREMENT,
                        name varchar(255) UNIQUE,
                        PRIMARY KEY (id)
);

CREATE TABLE IngredientCupboards(id           int NOT NULL AUTO_INCREMENT,
                                ingredient_id int NOT NULL,
                                cupboard_id   int NOT NULL,
                                PRIMARY KEY (id),
                                CONSTRAINT FK_IngredientCupboard FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id),
                                CONSTRAINT FK_CupboardIngredient FOREIGN KEY (cupboard_id)   REFERENCES Cupboards(id),
                                CONSTRAINT UQ_Food UNIQUE(ingredient_id, cupboard_id)
);

INSERT INTO Ingredients (name) VALUES ('Tomato');
INSERT INTO Ingredients (name) VALUES ('Cheese');
INSERT INTO Ingredients (name) VALUES ('Potato');
INSERT INTO Ingredients (name) VALUES ('Onion');

INSERT INTO Users (name, password, username, default_cupboard_id) VALUES ('Louis', 'pass', 'louisw', NULL);
INSERT INTO Users (name, password, username, default_cupboard_id) VALUES ('Ahmer', 'pass', 'ahmerb', NULL);

INSERT INTO Cupboards (user_id) VALUES (1);
INSERT INTO Cupboards (user_id) VALUES (2);

INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (1, 1);
INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (3, 1);

INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (2, 2);
INSERT INTO IngredientCupboards(ingredient_id, cupboard_id) VALUES (4, 2);
