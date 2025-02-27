const Joi = require("joi");
const logRepository = require("../repositories/LogRepository");
const userRepository = require("../repositories/UserRepository");
const modelService = require("./ModelService");
const helpers = require("../config/helpers");


const getPatients = async (req, res, next) => {

  const info = await userRepository.allUsersByType(type="patient");

  return info;
 
};

const getTreatment = async (req, res, next) => {

  const loginSchema = Joi.object().keys({
    symptoms: Joi.string().required()
  }).unknown();

  const validate = loginSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {symptoms} = req.body;
  const data = {user_id: req.user.user_id, symptoms, prompt: "What does this symptoms mean - "};

  await logRepository.logSymptoms(data);

  // const info = await modelService.getTreatment(symptoms);

  // return info;

  return "sample model response!";

};


const assignDoctor = async (req, res, next) => {

  const loginSchema = Joi.object().keys({
    doctor_id: Joi.string().required()
  }).unknown();

  const validate = loginSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {doctor_id} = req.body;
  const data = {patient_id: req.user.user_id, doctor_id};

  const checkDoctor = await userRepository.checkDoctor(doctor_id);
  const checkAssigned = await userRepository.checkAssigned(data);

  if(req.user.type != "patient")
  {
    return helpers.newError("only patients can perform this operation!", 400);
  }

  if(checkAssigned)
  {
    return helpers.newError("patient has already been assigned to a doctor!", 400);
  }

  if(checkDoctor)
  {
    await userRepository.assignDoctor(data);

    return;
  }

  return helpers.sendError("Unable to complete request at the moment!", 400);

  // const info = await modelService.getTreatment(symptoms);

  // return info;

  return "sample model response!";

};



module.exports = {
  getPatients,
  getTreatment,
  assignDoctor
};