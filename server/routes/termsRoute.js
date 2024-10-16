const express = require('express')
const router = express.Router();
const termController = require('../controller/termsController');
const { route } = require('./homeRoute');

router.post('/',termController.InsertTerm);
router.get('/',termController.getAllTerms);

module.exports = router