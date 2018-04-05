var express = require('express');
var router = express.Router();

/* GET all ingredients. */
router.get('/ingredients', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET cool. */
router.get('/cool', function(req, res, next) {
  res.send('you are so cool.');
});

module.exports = router;
