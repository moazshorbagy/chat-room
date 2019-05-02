var express = require('express');
var cors = require('cors');
var controller = require('./controller');
var cookieParser = require('cookie-parser');
var socket = require('socket.io');

var app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

//to allow the server to have control over GET, POST, ...
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.get('/home', (req, res) => { res.sendFile(__dirname + '/public/login.html') });
app.get('/room', (req, res) => { res.sendFile(__dirname + '/public/index.html') });
app.post('/login', controller.login);
app.post('/register', controller.signup);

// Connecting to database
require('./db/config').then(_ => {
    console.log('Database connected successfully!');
}).catch(error => {
    console.error('Error in connecting to database\n', error);
});

var server = app.listen(1234, function () {
    console.log('listening for requests on port 4000');
});

// Socket setup & pass server
var io = socket(server);

//middleware
io.use(async (socket, next) => {
    let token = socket.handshake.query.token;
    const username = await controller.getUsernameByToken(token);
    console.log(token);
    console.log(username);
    console.log(onlineUsers.indexOf(username));
    if (controller.authenticate(token) && onlineUsers.indexOf(username) == -1) {
        return next();
    }
    return next(new Error('authentication error'));
});


io.on('connection', async function (socket) {

    console.log('made socket connection', socket.id);

    // Add the new user to the list of online users
    const username = await controller.getUsernameByToken(socket.handshake.query.token);
    console.log(username);


    onlineUsers.push(username);
    socketIds.push(socket.id);


    // send the list of online users to the new user
    io.sockets.connected[socket.id].emit("onlineUsers", onlineUsers);

    // send chat history to new user
    console.log(await controller.loadMessages() + "   messages");
    io.sockets.connected[socket.id].emit("prevChat", JSON.stringify(await controller.loadMessages()));


    socket.broadcast.emit('userOnline', username);

    // Handle chat event
    socket.on('chat', function (data) {
        // console.log(data);
        console.log(socket.handshake.query.token);

        if (data.message[0] == "@") {
            
            var tempusername = data.message.split(' ')[0].slice(1);
            if(onlineUsers.indexOf(tempusername) != -1 ){
                io.sockets.connected[socketIds[onlineUsers.indexOf(tempusername)]].emit("chat", data);
                if (socketIds[onlineUsers.indexOf(tempusername)] != socket.id)
                io.sockets.connected[socket.id].emit("chat",data);
            }
        } else {
            io.sockets.emit('chat', data);
            console.log(data.value + " inserting");
            controller.insertMessage(username, data.message);
        }
    });

    // Handle typing event
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', async function () {
        console.log("hi");
        const disconnectedUsername = await controller.getUsernameByToken(socket.handshake.query.token);
        console.log(disconnectedUsername);
        socket.broadcast.emit('userOffline', disconnectedUsername);

        socketIds.splice(onlineUsers.indexOf(disconnectedUsername), 1);
        onlineUsers.splice(onlineUsers.indexOf(disconnectedUsername), 1);

    });
});

var onlineUsers = [];
var socketIds = [];
