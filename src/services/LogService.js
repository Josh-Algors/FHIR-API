const Joi = require("joi");
const logRepository = require("../repositories/LogRepository");
const genAIService = require("./GenAIService");
const helpers = require("../config/helpers");
const { get } = require("mongoose");

const createImage = async (req, res, next) => {

  const setGradingSchema = Joi.object().keys({
    template_id: Joi.string().required(),
    human_or_robot: Joi.string().valid('human', 'robot').required(),
    eyes: Joi.string().allow('').required(),
    nose: Joi.string().allow('').required(),
    mouth: Joi.string().allow('').required()
  }).unknown();

  const validate = setGradingSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {template_id, human_or_robot, eyes, nose, mouth} = req.body;
  const data = {user_id: req.user._id, human_or_robot, eyes, nose, mouth, template_id};

  const description = `${eyes}, ${nose}, ${mouth}`;

  const checkTemplate = await logRepository.checkTemplateById(template_id);

  if(!checkTemplate)
  {
    return helpers.newError("Invalid template! Try again", 400);
  }

  const slider_info = await logRepository.checkSlider(data);

  var image_base64 = "";
  var image_id = ""

  if(!slider_info)
  {

    const infos = {
      image_url: checkTemplate.url,
      mask_url: checkTemplate.mask_url
    };

    const getImage = await genAIService.generateImage(infos, description);

    const isValidImage = helpers.isValidBase64Image(getImage);

    if(!isValidImage)
    {
      return helpers.newError("Unable to generate image! Try again", 400);
    }
    
    const info = await logRepository.logSlider(data, getImage);
    console.log(data);

    image_base64 = getImage;
    image_id = info._id.toString();
  }
  else
  {
    image_base64 = slider_info.base_64;
    image_id = slider_info._id.toString();
  }

  data.slider_id = image_id;
  await logRepository.logUserSlider(data);

  return {
    slider_id: image_id,
    image_base64: image_base64
  };

};

const getInfos = async (req, res, next) => {

  const data = {
    human: {
      eyes: ['Eyes closed', 'Eyes without the sclera (all black)', 'Eyes without the iris and pupil (completely white)',
      'Smaller eyes', 'Larger eyes',
      'Eyes looking to the right', 'Eyes looking to the left', 'Eyes looking down', 'Eyes looking up'],
      nose: ['Larger nose', 'Smaller nose', 'Larger nostrils', 'Smaller nostrils', 'Wider bridge nostrils',
        'Narrower bridge nostrils', 'Broader/wider nostrils', 'No visible nostrils', 'Nostrils upturned'],
      mouth: ['Larger mouth Open', 'Mouth open with teeth visible Open', 'Fuller lips Open',
        'Thinner lips Open', 'Smiling Open', 'Larger mouth Closed', 'Mouth open with teeth Closed',
        'Fuller lips Closed', 'Thinner lips Closed', 'Smiling Closed']
    },
    robot: {
      eyes: ['Squares eyes', 'Triangles eyes', 'Rectangles eyes', 'No eyes', 'Closed eyes', 'Eyes looking left',
        'Eyes looking right', 'Eyes looking up', 'Eyes looking down'],
      nose: ['No nose', 'Square nostrils', 'Triangular nostrils', 'Rectangular nostrils', 'Smaller nostrils', 'Larger nostrils'],
      mouth: ['No mouth', 'Mouth open', 'Smiling']
    }
  }

  return data;
};

//feedback
const feedback = async (req, res, next) => {

  if(!req.params.slider_id)
  {
    return helpers.newError("Invalid slider id!", 400);
  }

  const setGradingSchema = Joi.object().keys({
    isHuman: Joi.string().valid('Yes', 'No', 'Not Quite').required(),
    feedback: Joi.string().optional()
  }).unknown();

  const validate = setGradingSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {isHuman, feedback} = req.body;
  const data = {isHuman, feedback, slider_id: req.params.slider_id, user_id: req.user._id.toString()};

  await logRepository.logFeedback(data);

  return;

};

//setFavorite
const setFavorite = async (req, res, next) => {

  if(!req.params.slider_id)
  {
    return helpers.newError("Invalid slider id!", 400);
  }

  const ratingSchema = Joi.object().keys({
    rating: Joi.number().valid(1, 2, 3, 4, 5).required()
  }).unknown();

  const validate = ratingSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {rating} = req.body;

  const data = {slider_id: req.params.slider_id, user_id: req.user._id.toString(), rating};

  const checkFavorite = await logRepository.checkFavorite(data);

  // if(!checkFavorite)
  // {
  await logRepository.logFavorite(data);

  //   return;
  // }

  // await logRepository.updateFavorite(data);

  return;

};

//addTemplate
const addTemplate = async (req, res, next) => {

  const templateSchema = Joi.object().keys({
    templates: Joi.array().items(
      Joi.object({
        image_url: Joi.string().uri().required(),
        mask_url: Joi.string().uri().required(),
      })
    ).required()
  }).unknown();

  const validate = templateSchema.validate(req.body);

  if (validate.error != null) {
    const errorMessage = validate.error.details.map((i) => i.message).join(".");
    throw new Error(errorMessage);
  }

  const {templates} = req.body;

  if(templates.length > 0)
  {
    for(template of templates)
    {
      const checkImages = await logRepository.checkTemplate(template.image_url);

      if(!checkImages)
      {
        await logRepository.addTemplate(template.image_url, template.mask_url);
      }
    }
  }

  return;
  
};

//allTemplates
const allTemplates = async (req, res, next) => {

  const allTemplates = await logRepository.allTemplates();

  return allTemplates;
  
};

//allFavorites
const allFavorites = async (req, res, next) => {

  const favorites = await logRepository.favorites(req.user._id);
  var collection = [];
  count = 1

  if(favorites.length > 0)
  {
    for(favorite of favorites)
    {
      const sliderInfo = await logRepository.getSlider(favorite.slider_id);

      if(sliderInfo)
      {
        const data = {
          slider_info: sliderInfo,
          rating: favorite.rating,
          count: count
        }

        collection.push(data);
        count += 1;
      }
    }  
  }


  return collection;
  
};


module.exports = {
  createImage,
  getInfos,
  feedback,
  setFavorite,
  addTemplate,
  allTemplates,
  allFavorites
};