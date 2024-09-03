const express = require('express');
const router = express.Router();
const messagesController = require('../controller/messagesController');

router.post('/', messagesController.sendMessage);
router.get('/', messagesController.getMessage);

module.exports = router;