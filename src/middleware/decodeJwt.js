const jwt_decode = require('jwt-decode');
const Joi = require('joi');
const helpers = require('../config/helpers');
require('dotenv').config();

const schema = Joi.object().keys({
    data: Joi.string().min(5).required()
});

const decodeMiddleware = (req,res,next) =>{

    const result = Joi.validate(req.body, schema);

    if(result.error != null)
    {
        return res.status(400).json(
            helpers.sendError("Data field is required")
        );
    }

    var token = req.body.data;

    try
    {
        var decoded = jwt_decode(token);
        console.log(decoded);
        req.body = decoded;
        next()
    }
    catch(e)
    {
        return res.status(400).json(
            helpers.sendError(e.message)
        );
    }

}

function authMiddleware(req, res, next) {
    const { username, password } = req.headers;

    const validUsername = process.env.AU;
    const validPassword = process.env.AP;
  
    if (username === validUsername && password === validPassword) {
      next(); // Proceed to the next
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  }

module.exports = {decodeMiddleware, authMiddleware};