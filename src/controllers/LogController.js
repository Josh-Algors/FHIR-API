const helpers = require("../config/helpers");
const patientService = require("../services/PatientService");
const doctorService = require("../services/DoctorService");
const guardianService = require("../services/GuardianService");
const { getTreatment } = require("../services/ModelService");

module.exports = {

  getPatients: async (req, res, next) => {
    
    try
    {
        const response = await patientService.getPatients(req);

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

  getTreatment: async (req, res, next) => {
    
    try
    {
        const response = await patientService.getTreatment(req);

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

  assignDoctor: async (req, res, next) => {
    
    try
    {
        const response = await patientService.assignDoctor(req);

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

  getGuardians: async (req, res, next) => {
    
    try
    {
        const response = await guardianService.getGuardians(req);

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

  getAllAssignedPatients: async (req, res, next) => {
    
    try
    {
        const response = await guardianService.getAllAssignedPatients(req);

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

  getDoctors: async (req, res, next) => {
    
    try
    {
        const response = await doctorService.getDoctors(req);

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

  allSymptomsOfAssignedPatients: async (req, res, next) => {
    
    try
    {
        const response = await doctorService.allSymptomsOfAssignedPatients(req);

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

  assignCaregiver: async (req, res, next) => {
    
    try
    {
        const response = await doctorService.assignCaregiver(req);

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

  getAllAssignedPatientsFromDoctor: async (req, res, next) => {
    console.log(req.user);
    try
    {
        const response = await doctorService.getAllAssignedPatients(req);

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

  prescriptions: async (req, res, next) => {
    
    try
    {
        const response = await doctorService.prescriptions(req);

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
