// The single place that maps URLs to route files.
const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Hub Contract endpoints: open to everyone, so they come before currentUser.
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));

// From here on, req.user says who is calling (or null).
router.use(currentUser);
router.use('/question-sets', require('./question-set.routes'));

// Mount your modules here, one line each. For example:
// router.use('/question-sets', require('./question-set.routes'));
// router.use('/sessions', require('./session.routes'));

module.exports = router;
