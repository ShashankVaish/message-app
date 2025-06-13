// models/message.model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
  },
  chatType: { type: String, enum: ['private', 'group'], default: 'private' },
  chatId: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model('Message', messageSchema);
export default Message;
