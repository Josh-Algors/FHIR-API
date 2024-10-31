require('dotenv').config();

var passport = require('passport');
var passportJWT = require('passport-jwt');
var JwtStrategy = passportJWT.Strategy;
var ExtractJwt = passportJWT.ExtractJwt;
var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET; 

var LocalStrategy = require('passport-local').Strategy;
const { Oauth } = require("../models/oauth");
const { User } = require("../models/user");
const helpers = require('./helpers');

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {

    try
    {
        var checkToken = await Oauth.findOne({
                email: jwt_payload.email,
                iat: jwt_payload.iat,
                exp: jwt_payload.exp,
            });
    
        if (!checkToken) {
            // throw new Error({status: "ERROR", message: "Unauthorized", code: 401});
            return done({status: "ERROR", message: "Unauthorizedss", code: 401}, false);
        }

        var userInfo = await User.findOne({ id: jwt_payload.id });
        
        if(!userInfo) {
            return done({status: "ERROR", message: "Unauthorized", code: 401}, false);
        }

        return done(null, userInfo);
    
    }
    catch(error)
    {
        return done({status: "ERROR", message: error.message, code: 500}, false)
    }
}));

function customErrorHandler(err, req, res, next) {
    
    const errorResponse = {
      message: 'You are Unauthorized to perform this operation!',
      code: 401 
    };

    return res.status(401).json(helpers.sendError(errorResponse.message, errorResponse.code));
};


module.exports = {
    customErrorHandler
};