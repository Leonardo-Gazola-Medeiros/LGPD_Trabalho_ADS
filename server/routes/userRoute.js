const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

// Rotas CRUD para usuários

router.post('/register', userController.createUser);

router.post('/login', userController.loginUser);

module.exports = router;