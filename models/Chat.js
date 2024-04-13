const mongoose = require('mongoose');

// Define chat schema
const chatSchema = new mongoose.Schema({
  chat_owner: {
    type: String,
    required: true
  },
  chat_content: [{
    type: String,
    required: true
  }]
});

// Create chat model
const Chat = mongoose.model('Chat', chatSchema);

// Export chat model
module.exports = Chat;