var express = require('express');
var cors = require('cors');
var controller = require('./controller');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
