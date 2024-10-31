const Joi = require("joi");
const userRepository = require("../repositories/UserRepository");
const helpers = require("../config/helpers");

const signIn = async (req, res, next) => {

  const userSchema = Joi.object().keys({
    email: Joi.string().required()
  }).unknown();

  const validate = userSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {email} = req.body;

  const info = await userRepository.findOrCreate(email);

  const token = helpers.signToken(info);

  return {email, token};

};


module.exports = {
  signIn
};