const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation,
  updateConversationTitle,
} = require('../controllers/chatController');

router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.post('/conversations/:id/messages', sendMessage);
router.delete('/conversations/:id', deleteConversation);
router.patch('/conversations/:id/title', updateConversationTitle);

module.exports = router;