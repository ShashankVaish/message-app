import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
// import { createServer, io } from "./sockets/index.js"
import { configureSocketIO } from "./sockets/index.js"
const app = express()
const __dirname = path.resolve(); // Get the current directory path

const clientBuildPath = path.join(__dirname, "..", "client", "dist");
// Middleware for CORS and other configurations
if(process.env.NODE_ENV != "production") {
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))}




app.use(express.static("public"))
app.use(express.json({limit:"50kb"}))
app.use(express.urlencoded({extended:true , limit:"50kb"}))
app.use(cookieParser())



// import studentRouter from "./routes/Student.routes.js"
import userRouter from "./routes/User.routes.js"
app.use("/api/v1/user",userRouter)
// for production, serve static files from the client build directory
if (process.env.NODE_ENV === "production") {
  // Serve static files from the client build
  app.use(express.static(clientBuildPath));

  // For all GET requests that are NOT API routes, send index.html (SPA fallback)
  app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
}


const  { io , httpServer } = configureSocketIO(app)


export {  httpServer, io } // Export the app and httpServer for use in other modulesq