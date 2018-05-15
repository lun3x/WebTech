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
    db.createTable('Cupboards', {
        id: {
            type: 'int',
            primaryKey: true,
            notNull: true,
            autoIncrement: true,
            unique: true,
            unsigned: true,
        },
        user_id: {
            type: 'int',
            notNull: true,
            unsigned: true,
            foreignKey: {
                name: 'FK_CupboardUser',
                table: 'Users',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'RESTRICT',
                },
                mapping: {
                    user_id: 'id',
                }
            }
        },
    }, callback);
};

exports.down = (db, callback) => {
    db.dropTable('Cupboards', callback);
};

exports._meta = {
    version: 1
};
