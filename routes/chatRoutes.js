const express = require('express');
const samarController = require('../controllers/samarController.js')

const router = express.Router();

// ASK SAMAR
router.post('/samar', samarController.chatCompletion);

// GET ALL CHATS
router.get('/samar/getChats', samarController.getChats);

// GET CHAT BY USER
router.get('/samar/getChatByUser', samarController.getChatByUser);

module.exports = router;