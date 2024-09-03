const express = require('express');
const router = express.Router();
const cookies = require('../controller/cookieController');

router.post();
router.get('/', cookies.cookieChecker);

module.exports = router;