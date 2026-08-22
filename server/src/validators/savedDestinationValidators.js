const { body, param } = require('express-validator');

const cityIdParamValidation = [param('cityId').trim().notEmpty().withMessage('City id is required')];

const saveDestinationValidation = [body('cityId').trim().notEmpty().withMessage('cityId is required')];

module.exports = { cityIdParamValidation, saveDestinationValidation };
