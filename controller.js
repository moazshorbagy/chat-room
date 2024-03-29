const User = require('./db/User');
const Chat = require('./db/Chat');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
  console.log("signup started");

  let userName = req.body.userName;
  let password = req.body.password;
  console.log(userName);
  console.log(password);
  if (!userName || !password) {
    console.log("register missing data");
    return res.status(400).json({
      error: "Missing data."
    });
  }
  try {
    let user = await User.findOne({ userName });
    if (user) {
      console.log("register username exists");
      return res.status(405).json({
        error: "user name already exists."
      });
    }

    user = new User();
    user.userName = userName;
    user.password = password;
    await user.save();
    console.log("register success");
    return res.status(200).json();
  } catch (e) {
    console.log(e);
    return res.status(status).json({
      error: "Internal server error"
    });
  };
}

async function login(req, res) {

  let userName = req.body.userName;
  let password = req.body.password;
  let roomPassword = req.body.roomPassword;

  console.log(userName);
  console.log(password);

  if (!userName || !password || !roomPassword) {
    console.log("login missong data");
    return res.status(400).json({
      error: "Missing data."
    });
  }

  if(roomPassword != "12345678"){
    return res.status(401).json({
      error: "Wrong room password"
    });
  }
  try {
    let user = await User.findOne({ userName });
    if (!user) {
      console.log("login wrong username");
      return res.status(400).json({     
        error: "You have entered a wrong user name."
      });
    }

    let valid = await user.checkPassword(password);

    if (!valid) {
      console.log("login wrong password");
      return res.status(400).json({
        error: "You have entered a wrong user name and/or password."
      });
    }

    let token = jwt.sign({ id: user.id },
      "secret"
    );

    res.cookie('userName', user.userName);
    res.cookie('token', token);

    //res.sendFile(__dirname + '/public/index.html');
    res.status(200).send();

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error'
    });
  };
}

async function getUsernameByToken(token) {
  if (!token)
    return -1;

  try {

    let payload = jwt.verify(token, "secret");
    let id = payload.id;
    let user = await User.findOne(id);

    return user.userName;

  } catch (error) {
    return -1;
  }
}

async function authenticate(token) {
  if (!token)
    return false;

  try {

    let payload = jwt.verify(token, "secret");
    let id = payload.id;
    let user = await User.findOne(id);

    if (user)
      return true;
    else
      return false;

  } catch (error) {
    return false;
  }
}

async function insertMessage(userName, message) {
  let chat = new Chat();
  chat.message = message;
  chat.userName = userName;
  await chat.save();
}

async function loadMessages() {
  let messages = await Chat.find({ order: { id: "ASC" } });
  return messages;
}

function logout(req, res) {
}

module.exports = {
  signup,
  login,
  getUsernameByToken,
  authenticate,
  insertMessage,
  loadMessages
}
