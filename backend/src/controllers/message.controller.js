// controllers/messageController.js
import { Message } from "../models/message.model.js";

export function messageController(io, socket) {
  // Socket must have user info, commonly attached in middleware
  

  socket.on('send_message', async (data) => {
    console.log(data)
    try {
      console.log('Received:', data);

      const newMessage = new Message({
        text: data.text,
        chatType: data.chatType || 'private',
        chatId: data.chatId,
        sender: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });

      const savedMessage = await newMessage.save();

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
      socket.emit('error_message', { message: 'Message send failed.' });
    }
  });
}
