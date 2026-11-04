// Hub Contract rule 7: the Library Game Hub reads finished games here.
const { Router } = require('express');
const hubKey = require('../middlewares/hub-key');
const validate = require('../middlewares/validate');
const controller = require('../controllers/results.controller');
const { sinceRules } = require('../validators/results.validator');

const router = Router();

router.get('/', hubKey, sinceRules, validate, controller.getResults);

module.exports = router;