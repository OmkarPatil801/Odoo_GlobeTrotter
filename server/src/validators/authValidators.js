const { body } = require('express-validator');

// Email format only — normalization (lowercasing/trimming) happens in the
// service layer, not here, so validation doesn't silently rewrite input
// with provider-specific rules (e.g. Gmail dot-stripping) that don't hold
// globally.
const registerValidation = [
  body('name')
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be at least 8 characters long'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
