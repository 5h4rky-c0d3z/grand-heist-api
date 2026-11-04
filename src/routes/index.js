// The single place that maps URLs to route files.
const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Hub Contract endpoints are mounted before currentUser.
// The /results endpoint additionally requires the Hub API key.
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

// From here on, req.user says who is calling (or null).
router.use(currentUser);

// Mount your modules here, one line each.
router.use('/question-sets', require('./question-set.routes'));
router.use('/sessions', require('./session.routes'));
module.exports = router;