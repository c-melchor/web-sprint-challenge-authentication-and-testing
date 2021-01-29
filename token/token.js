const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets");

function generateToken(user) {
    const payload = {
        username: user.username,
        password: user.password
    }
    const options = {
        expiresIn: 2000
    }
    return jwt.sign(payload, jwtSecret, options);
}

module.exports = { generateToken }
