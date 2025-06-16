// controllers/messageController.js
import { Message } from "../models/message.model.js";

export function messageController(io, socket) {
  // Socket must have user info, commonly attached in middleware
  
  socket.on('send_message', async (data) => {
    try {
      // Get user from socket (attached by socketAuthMiddleware)
      const user = socket.user;
      
      if (!user) {
        console.error('No user found in socket');
        socket.emit('error_message', { message: 'Authentication required' });
        return;
      }

      console.log('Received message data:', data);
      console.log('From user:', user._id);

      const newMessage = new Message({
        text: data.text,
        chatType: data.chatType || 'private',
        chatId: data.chatId,
        sender: {
          id: user._id,
          name: user.username, // Using username from user model
          email: user.email
        }
      });

      const savedMessage = await newMessage.save();
      console.log('Message saved successfully:', savedMessage._id);

      // Broadcast to all connected clients
      io.emit('new_message', {
        id: savedMessage._id,
        text: savedMessage.text,
        sender: savedMessage.sender,
        chatId: savedMessage.chatId,
        chatType: savedMessage.chatType,
        timestamp: savedMessage.timestamp
      });

    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error_message', { 
        message: 'Message send failed',
        error: error.message 
      });
    }
  });
}
export function messagehistoryController(io, socket) {
  socket.on('get_message_history', async (data) => {
    try {
      const { chatId, chatType } = data;
      console.log('Fetching message history for:', chatId, chatType);

      const messages = await Message.find({ chatId, chatType })
        .sort({ timestamp: -1 }) // Sort by timestamp descending
        .limit(50); // Limit to the last 50 messages

      console.log('Message history fetched successfully:', messages.length);

      socket.emit('message_history', messages);
    } catch (error) {
      console.error('Error fetching message history:', error);
      socket.emit('error_message', { 
        message: 'Failed to fetch message history',
        error: error.message 
      });
    }
  });
}
