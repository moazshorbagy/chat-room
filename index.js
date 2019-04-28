var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000');
});

// Static files
app.use(express.static('public'));



// Socket setup & pass server
var io = socket(server);

//middleware
io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if (token == "hi") {
      return next();
    }
    return next(new Error('authentication error'));
  });


io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    
    // send the list of online users to the new user
    io.sockets.connected[socket.id].emit("onlineUsers", onlineUsers);

    // Add the new user to the list of online users
    const username = getUsernameByToken(socket.handshake.query.token);
    onlineUsers.push(username);

    socket.broadcast.emit('userOnline', username);

    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        console.log(socket.handshake.query.token);
        io.sockets.emit('chat', data);

    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', function(){
        console.log("hi");
        const disconnectedUsername = getUsernameByToken(socket.handshake.query.token);
        socket.broadcast.emit('userOffline', disconnectedUsername);
        onlineUsers.splice(onlineUsers.indexOf(disconnectedUsername),1);
       
    });

});

const getUsernameByToken = function(token){
    return "user"+Math.random();
}
var onlineUsers = [];


