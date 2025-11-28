const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'New Conversation',
  },
  messages: [messageSchema],
  model: {
    type: String,
    default: 'llama3.2',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Conversation', conversationSchema);