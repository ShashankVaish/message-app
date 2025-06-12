import { Router } from "express";

const router = Router();


// Import the message controller functions
import { getMessages, sendMessage } from "../controllers/message.controller.js";


export default router