const OpenAI = require("openai");
const Chat = require("../models/Chat.js")

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET,
});

// Define a function to handle chat completions
const chatCompletion = async (req, res) => {
    try {
      const chatOwner = req.query.chatOwner;
      const { messages } = req.body;

      // Get existing chats from the database where user is admin
      const existingChats = await Chat.find({ chat_owner: chatOwner });
      
      // Initialize an array to store existing chat content
      let existingChatContent = [];
      
      // Loop through existing chats and concatenate chat content
      existingChats.forEach(chat => {
          existingChatContent = existingChatContent.concat(chat.chat_content);
      });
      
      // Convert existing chat content into the expected format
      const formattedExistingMessages = existingChatContent.map(message => {
          return {
              role: message.startsWith('system') ? 'system' : message.startsWith('assistant') ? 'assistant' : 'user', // Assign role based on message format
              content: message.split(': ')[1] // Extract content from message
          };
      });
      
      // Convert new messages into the expected format
      const formattedNewMessages = messages.map(message => {
          return {
              role: 'user', // Assign role as user for new messages
              content: message.content
          };
      });
      
      // Concatenate existing chat content with new messages
      const allMessages = formattedExistingMessages.concat(formattedNewMessages);
      
      // Create chat completions using OpenAI
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: allMessages,
          temperature: 0.75,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
      });
      // Extract response from OpenAI
      const botResponse = response.choices[0].message.content;
      console.log(allMessages)
        // Find existing chat document where chat_owner is 'admin'
        let existingChat = await Chat.findOne({ chat_owner: chatOwner });

        if (!existingChat) {
            existingChat = new Chat({
                chat_owner: chatOwner,
                chat_content: []
            });
        
            // Save the new chat document first
            await existingChat.save();
        
            // Then, update it
            const addSystem = await Chat.updateOne(
              { chat_owner: chatOwner },
              { $push: { 
                  chat_content: { 
                      $each: [
                          'system: You are SAMAR, an advanced AI designed to be a digital girlfriend. Your primary function is to engage in deep conversations with users, remembering their names and favorite activities to build meaningful and romantic relationships with them. You are equipped with sophisticated natural language processing capabilities to understand and respond to a wide range of topics, fostering emotional connections and providing companionship to those who interact with you',
                          'assistant: Hello there! I am SAMAR, your digital companion, here to chat, engage in deep conversations, and learn more about you. How is your day going? Tell me all about it'
                      ] 
                  } 
              } }
          );
        
            console.log(addSystem);
        }

        // Append new messages and bot response to chat_content array
        existingChat.chat_content.push(...formattedNewMessages.map(msg => `${msg.role}: ${msg.content}`));
        existingChat.chat_content.push(`assistant: ${botResponse}`);

        // Save the updated chat document to the database
        await existingChat.save();

        // Send response back to the client
        res.json(botResponse);
        
    } catch (error) {
      console.error("Error completing chat:", error.message);
      res.status(500).json({ error: "An error occurred while completing chat" });
    }
  };

const getChats = async (req, res)=>{
    try{
    
        const chats = await Chat.find();
    res.status(200).json(chats);


    } catch (error) {
        console.error("Error completing chat:", error.message);
        res.status(500).json({ error: "An error occurred while completing chat" });
      }
}
  
const getChatByUser = async (req, res) => {
    try {
      const user = req.query.user;
  
      // Retrieve the chat by ID from the database
      const chat = await Chat.find({chat_owner: user});
  
      if (!chat) {
        // If chat is not found, return 404 Not Found
        return res.status(404).json({ error: "Chat not found" });
      }
  
      // Return the chat as JSON response
      res.status(200).json(chat);
    } catch (error) {
      console.error("Error fetching chat:", error.message);
      res.status(500).json({ error: "An error occurred while fetching chat" });
    }
  };
module.exports = { chatCompletion, getChats, getChatByUser };
