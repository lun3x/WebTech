const express = require('express');

const router = express.Router();

const db = require('../database.js');
const authController = require('../controllers/authController.js');

router.get('/isAuthenticated', authController.isAuthenticated);
router.get('/logout', authController.logout);

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
