const { query } = require('express-validator');

const sinceRules = [
  query('since')
    .optional()
    .isISO8601()
    .withMessage('since must be a valid date and time')
    .bail()
    .toDate(),
];

module.exports = { sinceRules };