const Joi = require("joi");
const logRepository = require("../repositories/LogRepository");
const userRepository = require("../repositories/UserRepository");
const modelService = require("./ModelService");
const helpers = require("../config/helpers");


const getGuardians = async (req, res, next) => {

  const info = await userRepository.allUsersByType(type="guardian");

  return info;
 
};

const getAllAssignedPatients = async(req, res, next) => {
console.log(req.user);
  const info = await userRepository.assignedPatientsToGuardian(req.user.user_id);

  return info;

};



module.exports = {
  getGuardians,
  getAllAssignedPatients
};