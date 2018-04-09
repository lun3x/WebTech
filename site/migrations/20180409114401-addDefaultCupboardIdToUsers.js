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
    db.addColumn('Users', 'default_cupboard_id', {
        type: 'int',
        notNull: false,
        unsigned: true,
        foreignKey: {
            name: 'FK_DefaultCupboard',
            table: 'Cupboards',
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT'
            },
            mapping: {
                default_cupboard_id: 'id'
            }
        }
    }, callback);
};

exports.down = (db, callback) => {
    db.removeForeignKey('Users', 'FK_DefaultCupboard', (err) => {
        if (err) callback(err);
        db.removeColumn('Users', 'default_cupboard_id', callback);
    });
};

exports._meta = {
    version: 1
};
