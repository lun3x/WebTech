let dbm;
let type;
let seed;

/**
    * We receive the dbmigrate dependency from dbmigrate initially.
    * This enables us to not have to rely on NODE_PATH.
*/
exports.setup = (options, seedLink) => {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = (db, callback) => {
    db.createTable('Recipes', {
        id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: 'string',
            length: 255,
        },
        method: {
            type: 'text',
            length: 65535
        }
    }, (err) => {
        if (err) { callback(err); return; }
        db.createTable('RecipeIngredients', {
            id: {
                type: 'int',
                unsigned: true,
                notNull: true,
                autoIncrement: true,
                primaryKey: true,
            },
            ingredient_id: {
                type: 'int',
                notNull: true,
                unsigned: true,
                foreignKey: {
                    name: 'FK_IngredientRecipe',
                    table: 'Ingredients',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT'
                    },
                    mapping: {
                        ingredient_id: 'id'
                    }
                }
            },
            recipe_id: {
                type: 'int',
                notNull: true,
                unsigned: true,
                foreignKey: {
                    name: 'FK_RecipeIngredient',
                    table: 'Recipes',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT'
                    },
                    mapping: {
                        recipe_id: 'id'
                    }
                }
            },
        }, (err2) => {
            if (err2) callback(err2);
            else {
                db.runSql(
                    'COMMIT; ALTER TABLE RecipeIngredients ADD CONSTRAINT UQ_Recipeingredient UNIQUE(ingredient_id, recipe_id)',
                    //[],
                    callback
                );
            }
        });
    });
};

exports.down = (db, callback) => {
    db.dropTable('Recipes', (err) => {
        if (err) callback(err);
        else {
            db.dropTable('RecipeIngredients', callback);
        }
    });
};

exports._meta = {
    version: 1
};
