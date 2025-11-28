const Conversation = require('../models/Conversation');
const ollamaService = require('../services/ollamaService');
const { getRedisClient } = require('../config/redis');

const createConversation = async (req, res) => {
  try {
    const { title } = req.body;

    const conversation = new Conversation({
      title: title || 'New Conversation',
      messages: [],
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation',
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .select('_id title createdAt updatedAt');

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations',
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation',
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    conversation.messages.push({
      role: 'user',
      content: message,
    });

    await conversation.save();

    const messages = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let assistantResponse = '';

    const response = await ollamaService.chat(messages, (chunk) => {
      assistantResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    conversation.messages.push({
      role: 'assistant',
      content: response,
    });

    await conversation.save();

    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error sending message:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to process message' })}\n\n`);
    res.end();
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findByIdAndDelete(id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation',
    });
  }
};

const updateConversationTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Title is required',
      });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update conversation',
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation,
  updateConversationTitle,
};