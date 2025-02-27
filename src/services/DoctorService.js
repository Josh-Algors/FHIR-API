const Joi = require("joi");
const logRepository = require("../repositories/LogRepository");
const userRepository = require("../repositories/UserRepository");
const modelService = require("./ModelService");
const helpers = require("../config/helpers");


const getDoctors = async (req, res, next) => {

  const info = await userRepository.allUsersByType(type="doctor");

  return info;
 
};

const getAllAssignedPatients = async(req, res, next) => {

  const info = await userRepository.assignedPatientsToDoctor(req.user.user_id);

  return info;

}

const allSymptomsOfAssignedPatients = async(req, res, next) => {

  const info = await userRepository.assignedPatientsToDoctor(req.user._id);


  if(info.length > 0)
  {
    
    var allSymptoms = [];

    for(inf of info)
    {
      const getSymptoms = await logRepository.allSymptoms(inf.patient_id);

      if(getSymptoms)
      {
        allSymptoms.push(getSymptoms);
      }

    }

    return allSymptoms;

  }

  return info;

}

const assignCaregiver = async (req, res, next) => {

  const loginSchema = Joi.object().keys({
    guardian_id: Joi.string().required(),
    patient_id: Joi.string().required()
  }).unknown();

  const validate = loginSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  if(req.user.type != "doctor")
  {
    return helpers.newError("only doctors can perform this operation!", 400);
  }

  const {patient_id, guardian_id} = req.body;
  const data = {doctor_id: req.user.user_id, patient_id, guardian_id};

  const checkGuardian = await userRepository.checkGuardian(guardian_id);
  const checkPatient = await userRepository.checkPatient(patient_id);

  if(!checkGuardian || !checkPatient)
  {
    return helpers.newError("Unable to complete request! - Invalid Patient/Guardian ID.", 400);
  }

  const checkAssigned = await userRepository.checkAssignedGuardian(data);

  if(checkAssigned)
  {
    return helpers.newError("guardian has already been assigned to patient!", 400);
  }

  await userRepository.assignCaregiver(data);

  return;
  

};

const prescriptions = async (req, res, next) => {

  const loginSchema = Joi.object().keys({
    patient_id: Joi.string().required(),
    symptoms: Joi.string().required()
  }).unknown();

  const validate = loginSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  if(req.user.type != "doctor")
  {
    return helpers.newError("only doctors can perform this operation!", 400);
  }

  const {patient_id, symptoms} = req.body;
  const data = {doctor_id: req.user._id, patient_id, symptoms, prompt: "What prescriptions are for these - "};

  const checkPatient = await userRepository.checkPatient(patient_id);

  if(!checkPatient)
  {
    return helpers.sendError("Unable to complete request! - Invalid Patient ID.", 400);
  }

  // const getPrescriptions = await modelService.getTreatment(data);

  // return getPrescriptions;

  return "sample model response!";

};


module.exports = {
  getDoctors,
  getAllAssignedPatients,
  allSymptomsOfAssignedPatients,
  assignCaregiver,
  prescriptions
};