import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config()
const app =express()
app.use(express.json())
app.use(cors())
mongoose.connect("mongodb+srv://"+process.env.MONGO_UNAME+":"+process.env.MONGO_PWD+"@musicshare.kxbrits.mongodb.net/MusicShare?retryWrites=true&w=majority")
     .then(r =>console.log("db connected"))
app.listen(3001,()=> console.log("SERVER STARTED"))
