const express = require('express')
const router = express.Router();
const termController = require('../controller/termsController');
const { route } = require('./homeRoute');

// ----------- ROTA PARA PEGAR/EDITAR OS TERMOS EM SI -----------//

router.post('/',termController.InsertTerm);
router.get('/',termController.getAllTerms);


// ----------- ROTA PARA PEGAR/EDITAR AS CONDIÇÕES DOS TERMOS ----------- //

router.post('/cond', termController.InsertCondition);
router.get('/cond', termController.getAllOptionalConditions);
router.get('/obrigatorias', termController.getConditionsObrigatorias);

// ----------- ROTA PARA OS ACEITES DAS CONDIÇÕES ----------- //

router.post('/acc/insert/:user_id', termController.insertAceites);
router.get('/acc', termController.getAceites);
router.get('/acc/:id', termController.getUsuarioTermos);
router.post('/acc/:user_id', termController.AcceptLatestTerms);


module.exports = router