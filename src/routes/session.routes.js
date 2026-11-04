const { Router } = require('express');
const sessionController = require('../controllers/session.controller');
const playerController = require('../controllers/player.controller');
const sessionRules = require('../validators/session.validator');
const playerRules = require('../validators/player.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

router.post('/', requireUser('host'),
  sessionRules.createRules, validate, sessionController.create);
router.get('/:code', requireUser(),
  sessionRules.codeParam, validate, sessionController.get);
router.patch('/:code', requireUser('host'),
  sessionRules.statusRules, validate, sessionController.changeStatus);

// Players are a part of a session, so their URLs sit under it.
router.post('/:code/players', requireUser(),
  playerRules.joinRules, validate, playerController.join);
router.get('/:code/players', requireUser(),
  sessionRules.codeParam, validate, playerController.list);

module.exports = router;