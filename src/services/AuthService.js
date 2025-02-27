require('dotenv').config()
const Joi = require("joi");
const bcrypt = require('bcrypt');
const userRepository = require("../repositories/UserRepository");
const helpers = require("../config/helpers");


const signIn = async (req, res, next) => {

  const loginSchema = Joi.object().keys({
    type: Joi.string().valid('doctor', 'patient', 'guardian').required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  }).unknown();

  const validate = loginSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {type, email, password} = req.body;
  const data = {type, email, password};

  const info = await userRepository.checkEmailorUsernameorType(data);

  if(info)
  {

    const validatePassword = bcrypt.compareSync(password, info.password);

    if(validatePassword)
    {

      const token = helpers.signToken(info);

      return {other: {email: data.email, username: info.username, type}, token};

    }

    return helpers.newError("Invalid email/username/password!", 400);

  }

  return helpers.newError("Invalid email/username/password!", 400);

};

const signUp = async (req, res, next) => {

  const registerSchema = Joi.object().keys({
    type: Joi.string().valid('doctor', 'patient', 'guardian').required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
  }).unknown();

  const validate = registerSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {type, email, username, password} = req.body;
  const data = {type, email, username, password};

  const info = await userRepository.checkEmailorUsernameorType(data);

  if(info)
  {
    return helpers.newError("Email/Username exist!", 400);
  }

  await userRepository.createUser(data);

  const token = helpers.signToken(data);

  return {other: {email: data.email, username: data.username, type}, token};

};


module.exports = {
  signIn,
  signUp
};