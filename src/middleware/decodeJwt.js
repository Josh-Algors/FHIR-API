const jwt = require('jsonwebtoken');
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

// Middleware to verify the JWT token
function verifyToken (req, res, next) {

    const token = getTokenFromHeader(req);
  
    if (!token) {
        res.status(401).json({ message: 'Authentication failed' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send('Invalid Token');
    }
    
    return next();
  };

  const getTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  };
  

module.exports = {decodeMiddleware, authMiddleware, verifyToken};