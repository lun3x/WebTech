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
    db.createTable('Votes', {
        id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            autoIncrement: true,
            primaryKey: true,
        },
        recipe_id: {
            type: 'int',
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: 'FK_VoteRecipe',
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
        user_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            foreignKey: {
                name: 'FK_VoteUser',
                table: 'Users',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'RESTRICT'
                },
                mapping: {
                    user_id: 'id'
                }
            }
        },
        upvote: {
            type: 'boolean',
            notNull: true
        }
    }, (err) => {
        if (err) callback(err);
        else {
            db.runSql(
                'COMMIT; ALTER TABLE Votes ADD CONSTRAINT UQ_Vote UNIQUE(user_id, recipe_id)',
                //[],
                callback
            );
        }
    });
};

exports.down = (db, callback) => {
    db.dropTable('Votes', (err) => {
        if (err) callback(err);
    });
};

exports._meta = {
    version: 1
};
