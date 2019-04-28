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

var server = app.listen(3000, function () {
    console.log('listening for requests on port 4000');
});

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
    socket.on('chat', function (data) {
        // console.log(data);
        console.log(socket.handshake.query.token);
        io.sockets.emit('chat', data);

    });

    // Handle typing event
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', function () {
        console.log("hi");
        const disconnectedUsername = controller.getUsernameByToken(socket.handshake.query.token);
        socket.broadcast.emit('userOffline', disconnectedUsername);
        onlineUsers.splice(onlineUsers.indexOf(disconnectedUsername), 1);
    });
});

var onlineUsers = [];
