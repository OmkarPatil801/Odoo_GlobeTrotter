const { body, param, query } = require('express-validator');

const postIdParamValidation = [param('id').trim().notEmpty().withMessage('Post id is required')];

const listPostsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100').toInt(),
];

const createPostValidation = [
  body('tripId').optional({ nullable: true }).trim().notEmpty().withMessage('tripId must not be empty'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title is required')
    .isLength({ max: 200 })
    .withMessage('title must be at most 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('content is required')
    .isLength({ max: 10000 })
    .withMessage('content must be at most 10000 characters'),
  body('imageUrl').optional({ nullable: true }).isString().withMessage('imageUrl must be a string'),
];

module.exports = { postIdParamValidation, listPostsValidation, createPostValidation };
