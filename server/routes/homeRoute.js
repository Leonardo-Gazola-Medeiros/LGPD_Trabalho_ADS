const express = require('express');
const router = express.Router();
const messagesController = require('../controller/messagesController');

// Rotas para as funções da tela home

router.post('/', messagesController.sendMessage);

router.get('/', messagesController.getMessage);

module.exports = router;