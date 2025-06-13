// socketAuth.js
import jwt from 'jsonwebtoken';

export function socketAuthMiddleware(socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error('Auth token missing'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // attach user info to socket
    next();
  } catch (err) {
    return next(new Error('Invalid token'));
  }
}
