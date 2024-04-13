import express from 'express'
import cors from 'cors'
import {Server} from 'socket.io'
import http from 'http'
import { connect } from './config.js'
import {ChatModel} from './chat.schema.js'


const app = express()

// create server using http

const server = http.createServer(app)

// create socket server

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:['GET', "POST"]
    }
})


// use socket events

io.on('connection',(socket)=>{
    console.log('Connection is establised');

    socket.on('join',(data)=>{
        socket.username = data;
        ChatModel.find().sort({timestamp:1}).limit(50)
            .then(messages=>{
                socket.emit('load-messages',messages)
            }).catch(err=>{
                console.log(err);
            })
    })
    
    socket.on('new-message',(message)=>{
        let userMessage = {
            username: socket.username,
            message: message
        }

        const newChat = new ChatModel({
            username: socket.username,
            message:message,
            timestamp: new Date()
        })
        newChat.save();

        socket.broadcast.emit('broadcast-message',userMessage);
    })

    socket.on('disconnect',()=>{
        console.log('Connection is disconected');
    })
})

server.listen(3000,()=>{
    console.log('Server is listening on 3000');
    connect();
})