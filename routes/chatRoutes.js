const express = require('express');
const samarController = require('../controllers/samarController.js')

const router = express.Router();

router.post('/samar', samarController.chatCompletion);

module.exports = router;