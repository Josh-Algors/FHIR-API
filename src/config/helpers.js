require('dotenv').config();
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');

const { Oauth } = require("../models/oauth");

const sendError = (message, code) => {
    var error = {
        "status": "ERROR",
        "code": code,
        "message": message
    }

    return error;
}

const sendSuccess = (message, data = undefined) => {
    var success = {
        "status": "SUCCESS",
        "code": 200,
        "message": message,
        "data": data
    }

    return success;
}

const newError = (message, code, validation_code="") => {

    const error = new Error(message);
    error.status = code;
    error.validationcode  = validation_code;
    throw error;

}

const getPercentage = (numerator, denominator) => {

    return Math.round((numerator/denominator) * 100);

}

const signToken = (user) => {

    var token = jwt.sign({
      id: user.id,
      email: user.email
    },
      process.env.SECRET,
      {
        expiresIn: process.env.SESSION, //1800
      }
    );
  
    var decoded = jwt_decode(token);
    Oauth.create(decoded);
    return token;
};

const isValidBase64Image = (base64String) => {
    // Regular expression to check if it's a valid Base64 string
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/; // Matches the Base64 string format

    return base64Regex.test(base64String);
}


module.exports = {
    sendError,
    sendSuccess,
    newError,
    getPercentage,
    signToken,
    isValidBase64Image
}