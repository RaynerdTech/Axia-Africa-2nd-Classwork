const express = require('express');
const route = express.Router()
const { register, loginUser } = require('../controllers/auth');


route.post('/users', register);
route.post('/login', loginUser);

module.exports = route;