const express = require('express');
const { success } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', (req, res) => {
  success(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
