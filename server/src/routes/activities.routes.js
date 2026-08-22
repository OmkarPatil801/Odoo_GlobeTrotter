const express = require('express');

const createActivityController = require('../controllers/activityController');
const createActivityService = require('../services/activityService');
const { activityRepository } = require('../repositories');
const { validate } = require('../validators');
const { activityIdParamValidation, searchActivitiesValidation } = require('../validators/activityValidators');

// Shares the same repository instance as the nested route wired in
// src/routes/cities.routes.js — both pull activityRepository from the
// single composition point, src/repositories/index.js.
const activityService = createActivityService(activityRepository);
const activityController = createActivityController(activityService);

const router = express.Router();

// Public — no authentication required. /search before /:id.
router.get('/search', searchActivitiesValidation, validate, activityController.search);
router.get('/:id', activityIdParamValidation, validate, activityController.getById);

module.exports = router;
