// import socket from 'socket.io';
import { Server } from 'socket.io'; 
import { createServer } from 'http';
// import { app } from '../app.js';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';
import { messageController } from '../controllers/message.controller.js';
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

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        messageController(io,socket);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

        
    });

    return {io, httpServer};
}

export { configureSocketIO }; // Export the io instance for use in other modules
