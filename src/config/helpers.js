require('dotenv').config();
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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
console.log(user._id);
    var token = jwt.sign({
      user_id: user._id,
      email: user.email
    },
      process.env.SECRET,
      {
        expiresIn: process.env.SESSION, //1800
      }
    );
  
    var decoded = jwt_decode(token);
    Oauth.create(decoded);
    console.log("Oauth ===== ", decoded);
    return token;
};

const isValidBase64Image = (base64String) => {
    // Regular expression to check if it's a valid Base64 string
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/; // Matches the Base64 string format

    return base64Regex.test(base64String);
}

const convertImageToBase64 = async (imagePath) => {
    
    try
    {
        const faceImageResponse = await axios.get(imagePath, {
            responseType: 'arraybuffer',
          });

        return faceImageResponse;
    }
    catch(error)
    {
        console.log(`error complete request - ${error.message}`);
    }
}

const imageConfig = (type) => {

    try
    {
        const configMeasurement = {
            "black-male": {
                eyes: {
                    x: 181, 
                    y: 163, 
                    h: 700, 
                    w: 255
                },
                nose: {
                    x: 392, 
                    y: 422, 
                    h: 243, 
                    w: 190
                },
                mouth: {
                    x: 312, 
                    y: 642, 
                    h: 407, 
                    w: 185
                },
            },
            "black-female": {
                eyes: {
                    x: 96, 
                    y: 40, 
                    h: 832, 
                    w: 356
                },
                nose: {
                    x: 355, 
                    y: 394, 
                    h: 322, 
                    w: 200
                },
                mouth: {
                    x: 271, 
                    y: 626, 
                    h: 498, 
                    w: 269
                },
            },
            "blue-robot-smooth": {
                eyes: {
                    x: 233, 
                    y: 350, 
                    h: 580, 
                    w: 264
                },
                nose: {
                    x: 444, 
                    y: 615, 
                    h: 180, 
                    w: 95
                },
                mouth: {
                    x: 418, 
                    y: 711, 
                    h: 216, 
                    w: 114
                },
            },
            "other-robot-rough": {
                eyes: {
                    x: 142, 
                    y: 157, 
                    h: 743, 
                    w: 388
                },
                nose: {
                    x: 408, 
                    y: 547, 
                    h: 224, 
                    w: 150
                },
                mouth: {
                    x: 286, 
                    y: 694, 
                    h: 462, 
                    w: 134
                },
            },
            "blue-robot-rough": {
                eyes: {
                    x: 162, 
                    y: 307, 
                    h: 701, 
                    w: 319
                },
                nose: {
                    x: 447, 
                    y: 560, 
                    h: 139, 
                    w: 139
                },
                mouth: {
                    x: 411, 
                    y: 734, 
                    h: 214, 
                    w: 91
                },
            },
            "light-black-female": {
                eyes: {
                    x: 99, 
                    y: 99, 
                    h: 836, 
                    w: 315
                },
                nose: {
                    x: 373, 
                    y: 421, 
                    h: 317, 
                    w: 229
                },
                mouth: {
                    x: 280, 
                    y: 673, 
                    h: 496, 
                    w: 200
                },
            },
            "light-black-male": {
                eyes: {
                    x: 134, 
                    y: 185, 
                    h: 726, 
                    w: 257
                },
                nose: {
                    x: 373, 
                    y: 443, 
                    h: 237, 
                    w: 195
                },
                mouth: {
                    x: 276, 
                    y: 656, 
                    h: 444, 
                    w: 190
                },
            },
            "light-female": {
                eyes: {
                    x: 88, 
                    y: 57, 
                    h: 851, 
                    w: 315
                },
                nose: {
                    x: 395, 
                    y: 375, 
                    h: 253, 
                    w: 220
                },
                mouth: {
                    x: 320, 
                    y: 603, 
                    h: 416, 
                    w: 247
                },
            },
            "light-male": {
                eyes: {
                    x: 146, 
                    y: 79, 
                    h: 761, 
                    w: 301
                },
                nose: {
                    x: 396, 
                    y: 380, 
                    h: 278, 
                    w: 226
                },
                mouth: {
                    x: 302, 
                    y: 603, 
                    h: 465, 
                    w: 243
                },
            },
        };

        return configMeasurement[type];
    }
    catch(error)
    {
        console.log("Invalid config type");
    }
}

const calculateTimeSpent = (interactions) => {

    interactions.forEach((interaction, index) => {
        if (index < interactions.length - 1) {
            const startTime = new Date(interaction.createdAt);
            const endTime = new Date(interactions[index + 1].createdAt);
            const duration = (endTime - startTime) / 1000; // Duration in seconds
            interaction.time_spent = `${duration} seconds`;
            console.log(`Time spent on slider by ${interaction.user} for template ${interaction.template_id}: ${duration} seconds`);
        } else {
            // Optionally handle the last interaction differently since we cannot calculate its duration
            interaction.time_spent = `${0} seconds`; // Indicate undefined duration
        }
    });

    return interactions;

};


module.exports = {
    sendError,
    sendSuccess,
    newError,
    getPercentage,
    signToken,
    isValidBase64Image,
    convertImageToBase64,
    imageConfig,
    calculateTimeSpent
}