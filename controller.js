const User = require('./db/User');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
  let userName = req.body.userName;
  let password = req.body.password;
  if (!userName || !password) {
    return res.status(400).json({
      error: "Missing data."
    });
  }
  try {
    let user = await User.findOne({ userName });
    if (user) {
      return res.status(405).json({
        error: "user name already exists."
      });
    }

    user = new User();
    user.userName = userName;
    user.password = password;
    await user.save();

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

  if (!userName || !password) {
    return res.status(400).json({
      error: "Missing data."
    });
  }
  
  try {
    let user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        error: "You have entered a wrong user name."
      });
    }

    let valid = await user.checkPassword(password);

    if (!valid) {
      return res.status(400).json({
        error: "You have entered a wrong email and/or password."
      });
    }

    let token = jwt.sign({ id: user.id },
      "secret"
    );

    return res.status(200).json({
      token: token,
      userId: user.id,
      userName: user.userName
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error'
    });
  };
}

function authenticate(req, res, next) {
  
  let token = req.headers["token"];
  if (!token)
    return res.status(401).json({
      error: "No token provided."
    });

  jwt.verify(token, "secret", async function (err, payload) {
    if (err) {
      return res.status(401).json({
        error: "Failed to authenticate token."
      });
    }
    try {
      let id = payload.id;
      let user = await User.findOne(id);

      return user.userName;
      
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 'Internal server error'
      });
    };
  });
}

function logout(req, res) {
}

module.exports = {
  signup,
  login,
  authenticate
}
