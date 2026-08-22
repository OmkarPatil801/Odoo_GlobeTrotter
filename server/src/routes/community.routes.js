const express = require('express');

const createCommunityPostController = require('../controllers/communityPostController');
const createCommunityPostService = require('../services/communityPostService');
const { communityPostRepository } = require('../repositories');
const authenticate = require('../middleware/auth');
const { validate } = require('../validators');
const { postIdParamValidation, listPostsValidation, createPostValidation } = require('../validators/communityPostValidators');

// Default wiring for the running app — in-memory or Prisma repositories,
// chosen once in src/repositories/index.js.
const communityPostService = createCommunityPostService({ communityPostRepository });
const communityPostController = createCommunityPostController(communityPostService);

const router = express.Router();

// Reading community posts is public — browsing shared itineraries
// doesn't require an account. Creating a post does (the author is
// always the authenticated user, never a client-supplied userId).
router.get('/posts', listPostsValidation, validate, communityPostController.list);
router.get('/posts/:id', postIdParamValidation, validate, communityPostController.getById);
router.post('/posts', authenticate, createPostValidation, validate, communityPostController.create);

module.exports = router;
