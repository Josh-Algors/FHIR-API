const helpers = require("../config/helpers");
const logService = require("../services/LogService");

module.exports = {

  createEvent: async (req, res, next) => {
    
    try
    {
        const response = await logService.createImage(req);

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

  //getInfos
  getInfos: async (req, res, next) => {
    
    try
    {
        const response = await logService.getInfos(req);

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

  //feedback
  feedback: async (req, res, next) => {
    
    try
    {
        await logService.feedback(req);

        return res.status(200).json(helpers.sendSuccess("successful!"));
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

  //setFavorite
  setFavorite: async (req, res, next) => {
    
    try
    {
        await logService.setFavorite(req);

        return res.status(200).json(helpers.sendSuccess("successful!"));
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

  //addTemplate
  addTemplate: async (req, res, next) => {
    
    try
    {
        await logService.addTemplate(req);

        return res.status(200).json(helpers.sendSuccess("successful!"));
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

  //allTemplates
  allTemplates: async (req, res, next) => {
    
    try
    {
        const info = await logService.allTemplates(req);

        return res.status(200).json(helpers.sendSuccess("successful!", info));
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

  //allFavorites
  allFavorites: async (req, res, next) => {
    
    try
    {
        const info = await logService.allFavorites(req);

        return res.status(200).json(helpers.sendSuccess("successful!", info));
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
