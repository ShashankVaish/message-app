import { app } from './app.js';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';  
dotenv.config()// Load environment variables


const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1); // Exit the process with failure
    }
}
startServer();