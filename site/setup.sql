CREATE TABLE Users(id int NOT NULL AUTO_INCREMENT,
                   name varchar(255),
                   password varchar(255),
                   username varchar(255),
                   PRIMARY KEY (id)
);

CREATE TABLE Cupboards(id int NOT NULL AUTO_INCREMENT,
                       user_id int NOT NULL,
                       PRIMARY KEY (id),
                       CONSTRAINT FK_CupboardUser FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Ingredients(id int NOT NULL AUTO_INCREMENT,
                        name varchar(255),
                        PRIMARY KEY (id)
);

CREATE TABLE IngredientCupboards(id int NOT NULL AUTO_INCREMENT,
                                ingredient_id int NOT NULL,
                                cupboard_id int NOT NULL,
                                PRIMARY KEY (id),
                                CONSTRAINT FK_IngredientCupboard FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id),
                                CONSTRAINT FK_CupboardIngredient FOREIGN KEY (cupboard_id) REFERENCES Cupboards(id)
);
