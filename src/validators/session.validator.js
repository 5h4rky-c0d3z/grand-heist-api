const { body, param } = require('express-validator');

// Data dictionary: join_code CHAR(6), six digits, no leading 0 (in the URL).
const codeParam = [
  param('code')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('the join code must be six digits'),
];

// Data dictionary: set_id INTEGER, the question set to play.
const createRules = [
  body('set_id')
    .exists().withMessage('set_id is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('set_id must be a positive whole number')
    .bail()
    .toInt(),
];

// Data dictionary: status CHECK (waiting, playing, ended).
// A client may only ask for two of the three values.
const statusRules = [
  ...codeParam,
  body('status')
    .exists().withMessage('status is required')
    .bail()
    .isString().withMessage('status must be text')
    .bail()
    .isIn(['playing', 'ended'])
    .withMessage('status must be playing or ended'),
];

module.exports = { codeParam, createRules, statusRules };