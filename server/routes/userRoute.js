const express = require('express');
const router = express.Router();
const userController = require('../controller/user');


router.post('/register', userController.createUser);

router.post('/login', userController.loginUser);

router.delete('/:userId', userController.deleteUser);

module.exports = router;