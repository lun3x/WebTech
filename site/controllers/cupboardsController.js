// cupboardsController.js

const db = require('../database.js');

exports.get_user_cupboard = (req, res) => {
    let user_id = req.params.user_id;

    res.setHeader('Content-Type', 'application/json');

    db.returnCupboard(user_id, res);
};
