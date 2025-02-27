const helpers = require("../config/helpers");
const authService = require("../services/AuthService");

module.exports = {

  signIn: async (req, res, next) => {
    
    try
    {
        const response = await authService.signIn(req);

        return res.status(200).json(helpers.sendSuccess("successful!", response));
    } 
    catch (error)
    {
        if(error.status)
        {
            return res.status(error.status).json(helpers.sendError(error.message, error.status));
        }

        return res.status(500).json(helpers.sendError(error.message, 500));
    }

  },

  //signup
  signUp: async (req, res, next) => {
    
    try
    {
        const response = await authService.signUp(req);

        return res.status(200).json(helpers.sendSuccess("successful!", response));
    } 
    catch (error)
    {
        if(error.status)
        {
            return res.status(error.status).json(helpers.sendError(error.message, error.status));
        }

        return res.status(500).json(helpers.sendError(error.message, 500));
    }

  },

};
