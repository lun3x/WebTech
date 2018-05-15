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
    db.createTable('Ingredients', {
        id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        name: {
            type: 'string',
            length: 255,
            unique: true,

        }
    }, (err) => {
        if (err) { callback(err); return; }
        db.createTable('IngredientCupboards', {
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
                    name: 'FK_IngredientCupboard',
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
            cupboard_id: {
                type: 'int',
                notNull: true,
                unsigned: true,
                foreignKey: {
                    name: 'FK_CupboardIngredient',
                    table: 'Cupboards',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT'
                    },
                    mapping: {
                        cupboard_id: 'id'
                    }
                }
            },
        }, (err2) => {
            if (err2) callback(err2);
            else {
                db.runSql(
                    'COMMIT; ALTER TABLE IngredientCupboards ADD CONSTRAINT UQ_IngredientCupboard UNIQUE(ingredient_id, cupboard_id)',
                    //[],
                    callback
                );
            }
        });
    });
};

exports.down = (db, callback) => {
    db.dropTable('Ingredients', (err) => {
        if (err) callback(err);
        else {
            db.dropTable('IngredientCupboards', callback);
        }
    });
};

exports._meta = {
    version: 1
};
