
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    username:String,
    message:String,
    timestamp:Date
})

export const ChatModel = mongoose.model('Chat',ChatSchema)