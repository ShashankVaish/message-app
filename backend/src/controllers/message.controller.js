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
