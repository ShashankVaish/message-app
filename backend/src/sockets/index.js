// import socket from 'socket.io';
import { Server } from 'socket.io'; 
import { createServer } from 'http';
// import { app } from '../app.js';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';
import { socketAuthMiddleware } from '../middleware/socketAuth.js';

import { messageController } from '../controllers/message.controller.js';
// import {apiError } from '../middlewares/apiError.js';
dotenv.config(); // Load environment variables
// const httpServer = createServer(app);

// 
function configureSocketIO(app) {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.use(socketAuthMiddleware)

    io.on('connection', (socket) => {
     messageController(io, socket);
});
    

    return {io, httpServer};
}

export { configureSocketIO }; // Export the io instance for use in other modules
