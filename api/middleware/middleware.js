const db = require("../../data/dbConfig");
const express = require("express");
const router = express.Router();
const User = require("../users/users-model");

async function validateUserBody(req, res, next) {
    const user = await req.body;
    const validUserBody = user.username && user.password;
    try {
        if (validUserBody) {
            next();
        } else {
            res.status(404).json("username and password required")
        }

    }
    catch (error) {
        res.status(404).json("username taken")
    }
};

module.exports = { validateUserBody }
