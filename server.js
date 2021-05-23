const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser,userLeaves } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName = 'Admin'

// Run when a client connects
io.on('connection', socket => {

    socket.on('joinRoom',({username}) => {

        const user = userJoin(socket.id, username)

        socket.join('chat');

        // Welcome current user
        socket.emit('event', formatMessage(botName,'Welcome to chat app!'))

        // Broadcast when a user connects
        socket.broadcast.to('chat').emit('event', formatMessage(botName,`${user.username} has joined the chat`));

    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)

        // io.to('chat').emit('message',formatMessage(user.username,msg))
        // Send own message to user
        socket.emit('ownMessage', formatMessage(user.username,msg))

        // Send message to other users
        socket.broadcast.to('chat').emit('message', formatMessage(user.username,msg));
    })

    // Broadcast when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id)

        if (user){
         io.to('chat').emit('event',formatMessage(botName,`${user.username} has left the chat`))
        }
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

 