// import socket from 'socket.io';
import { Server } from 'socket.io'; 
import { createServer } from 'http';
// import { app } from '../app.js';
// import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';
import { socketAuthMiddleware } from '../middleware/socketAuth.js';

import { messageController,messagehistoryController } from '../controllers/message.controller.js';
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
    console.log("middleware loaded")
    io.use(socketAuthMiddleware)

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        messageController(io, socket);
        messagehistoryController(io, socket);
        
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

        // Initialize message controller for this socket
     
});
    

    return {io, httpServer};
}

export { configureSocketIO }; // Export the io instance for use in other modules
