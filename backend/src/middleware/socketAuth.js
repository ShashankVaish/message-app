// middleware/socketAuth.js
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];

    if (!token) {
      console.log("No token provided");
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found for decoded ID:", decoded.id);
      return next(new Error("Unauthorized"));
    }

    socket.user = user; // Attach to socket
    console.log("Authenticated user:", user.name);
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Unauthorized"));
  }
};
