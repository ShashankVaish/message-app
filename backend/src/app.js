import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


// import { createServer, io } from "./sockets/index.js"
import { configureSocketIO } from "./sockets/index.js"
const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.static("public"))
app.use(express.json({limit:"50kb"}))
app.use(express.urlencoded({extended:true , limit:"50kb"}))
app.use(cookieParser())


// import studentRouter from "./routes/Student.routes.js"
import userRouter from "./routes/User.routes.js"
app.use("/api/v1/user",userRouter)


const  {io,httpServer } = configureSocketIO(app)


export {  httpServer, io } // Export the app and httpServer for use in other modulesq