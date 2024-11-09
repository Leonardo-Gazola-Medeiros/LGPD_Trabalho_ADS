const express = require('express')
const router = express.Router();
const termController = require('../controller/termsController');
const { route } = require('./homeRoute');

// ----------- ROTA PARA PEGAR/EDITAR OS TERMOS EM SI -----------//

router.post('/',termController.InsertTerm);
router.get('/',termController.getAllTerms);


// ----------- ROTA PARA PEGAR/EDITAR AS CONDIÇÕES DOS TERMOS ----------- //

router.post('/cond', termController.InsertCondition);
router.get('/cond', termController.getAllConditions);

// ----------- ROTA PARA OS ACEITES DAS CONDIÇÕES ----------- //

router.post('/acc', termController.insertAceites);
router.get('/acc', termController.getAceites);
router.get('/acc/:id', termController.getUsuarioTermos);
router.post('/acc/:id', termController.AcceptLatestTerms);


module.exports = router