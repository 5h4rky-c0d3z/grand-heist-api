const { body, param } = require('express-validator');

// Data dictionary: title VARCHAR(80) NOT NULL.
// Trim first, then measure, so three spaces do not pass as a title.
const title = () =>
  body('title')
    .exists().withMessage('title is required')
    .bail()
    .isString().withMessage('title must be text')
    .bail()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('title must be 3 to 80 characters long');

// Data dictionary: set_id INTEGER (in the URL).
const idParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive whole number')
    .bail()
    .toInt(),
];

const createRules = [title()];

// PATCH only has one changeable field, so title stays required.
const updateRules = [...idParam, title()];

module.exports = { createRules, updateRules, idParam };