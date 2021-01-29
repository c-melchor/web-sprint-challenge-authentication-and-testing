const router = require('express').Router();
const bcrypt = require("bcrypt");
const secrets = require("../../config/secrets");
const jwt = require("jsonwebtoken");
const User = require("../users/users-model");
const { generateToken } = require("../../token/token");
const { validateUserBody } = require("../middleware/middleware");

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
    .catch((err) => { res.status(500).json(err) });
});

module.exports = router;
