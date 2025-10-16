// controllers/messageController.js
import { verifyUserJWT } from "../middleware/auth.middleware.js";
import { Message } from "../models/message.model.js";
import { apiResponse } from "../utils/apiResponse.uitil.js";
import { asyncAwaitHandler } from "../utils/asyncAwaithandler.util.js";

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
  socket.on('get_message_history', asyncAwaitHandler(async (data)=>{
    try {
      // console.log("the io data ",io)
      // console.log("the is data :- ",data)
      const user = socket.user;
      console.log("user",user)
      const { chatId, chatType } = data;
      // const userdetails = req.User
      console.log('Fetching message history for:', chatId, chatType);

      const messages = await Message.find({ chatId, chatType })
        .sort({ timestamp: -1 }) // Sort by timestamp descending
        .limit(50); // Limit to the last 50 messages
      

      console.log('Message history fetched successfully:', messages.length);

      socket.emit('message_history', messages.reverse());
      await  Message.updateMany({
        chatId,readby:{$ne:user._id}},{
          $push:{readby:user._id}
        
      })

    } catch (error) {
      console.error('Error fetching message history:', error);
      socket.emit('error_message', { 
        message: 'Failed to fetch message history',
        error: error.message 
      });
    }
  }));

}

export function markAsUnReadMessage(io,socket){
  socket.on('read_message_by_user',asyncAwaitHandler(
    async (data)=>{
      const userdetails = socket.user
      console.log(userdetails)
      try {
        const {chatId,chatType}=data;
        const messages = await Message.find({chatId,chatType,readby:{$ne:userdetails._id}})
        console.log("unread messages ",messages)
        
        
        socket.emit('unread_messages_response', {
          chatId,
          chatType,
          messages: messages
        })
        

      } catch (error) {
        console.error('error fetching unread message :',error)
        socket.emit('error_message',{
          message:"failed to fetch the unread message ",
          error:error.message
        }) 
      }
    }
  ))}
