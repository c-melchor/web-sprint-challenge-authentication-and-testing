const router = require('express').Router();
const bcrypt = require("bcrypt");
const secrets = require("../../config/secrets");
const jwt = require("jsonwebtoken");
const User = require("../users/users-model");
const { generateToken } = require("../../token/token");
const { validateUserBody, validUser } = require("../middleware/middleware");


router.post('/register', validateUserBody, (req, res) => {
  const user = req.body;
  const hashed = bcrypt.hashSync(user.password, 10);
  if (user) {
    user.password = hashed;
    User.insert(user)
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(error => {
        res.status(500).json("username taken")
      })
  } else {
    res.status(400).json("Please provide valid credentials")
  }
});

router.post('/login', validateUserBody, (req, res) => {
  const { username, password } = req.body;
  User.getBy(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token })
      } else if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).json("invalid credentials")
      }
    })
    .catch((err) => { res.status(500).json(err) })
})
// .catch(err => { res.status(500).json("error") })
// }

// res.end('implement login, please!');
/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.

  1- In order to log into an existing account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel",
      "password": "foobar"
    }

  2- On SUCCESSFUL login,
    the response body should have `message` and `token`:
    {
      "message": "welcome, Captain Marvel",
      "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
    }

  3- On FAILED login due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
    the response body should include a string exactly as follows: "invalid credentials".
*/


module.exports = router;
