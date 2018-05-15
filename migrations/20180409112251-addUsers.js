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
    db.createTable('Users', {
        id: {
            type: 'int',
            primaryKey: true,
            unsigned: true,
            notNull: true,
            autoIncrement: true,
            unique: true,
        },
        name: { type: 'string', length: 255 },
        password: { type: 'string', length: 255 },
        username: { type: 'string', unique: true, length: 255 }
    }, callback);
};

exports.down = (db, callback) => {
    db.dropTable('Users', callback);
};

exports._meta = {
    version: 1
};
