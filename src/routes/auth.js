const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

//signin
router.post('/register', AuthController.signUp);
router.post('/login', AuthController.signIn);


module.exports = router;