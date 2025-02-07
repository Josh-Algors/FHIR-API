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

  //addCrop
  addCrop: async (req, res, next) => {
    
    try
    {
        const info = await logService.addCrop(req);

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

  //allCollections
  allCollections: async (req, res, next) => {
    
    try
    {
        const info = await logService.allCollections(req);

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

  interactionLogs: async (req, res, next) => {
    
    try
    {
        const info = await logService.interactionLogs(req);

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

  //favLogs
  favLogs: async (req, res, next) => {
    
    try
    {
        const info = await logService.favoriteLogs(req);

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

  //singleTemplate
  singleTemplate: async (req, res, next) => {
    
    try
    {
        const info = await logService.singleTemplate(req);

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

  //feedbackLogs
  feedbackLogs: async (req, res, next) => {
    
    try
    {
        const info = await logService.feedbackLogs(req);

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

//   saveConfig
saveConfig: async (req, res, next) => {
    
    try
    {
        const info = await logService.saveConfig(req);

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

  //sliderBase
  sliderBase: async (req, res, next) => {
    
    try
    {
        const info = await logService.sliderBase(req);

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

  //allSliderBase
  allSliderBase: async (req, res, next) => {
    
    try
    {
        const info = await logService.allSliderBase(req);

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
