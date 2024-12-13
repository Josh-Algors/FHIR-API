const Joi = require("joi");
const logRepository = require("../repositories/LogRepository");
const genAIService = require("./GenAIService");
const helpers = require("../config/helpers");
const sharp = require('sharp');
const { get } = require("mongoose");

const createImages = async (req, res, next) => {

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

  const description = `${eyes}, ${nose}, ${mouth}, without touching the other parts of the face.`;

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
  console.log(image_base64);

  return {
    slider_id: image_id,
    image_base64: image_base64
  };

};

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

  const description = `${eyes}, ${nose}, ${mouth}, without touching the other parts of the face.`;

  const checkTemplate = await logRepository.checkTemplateById(template_id);

  if(!checkTemplate)
  {
    return helpers.newError("Invalid template! Try again", 400);
  }

  const eyesImage = await logRepository.getEyes(template_id, eyes);
  const noseImage = await logRepository.getNose(template_id, nose);
  const mouthImage = await logRepository.getMouth(template_id, mouth);

  const imageAxis = helpers.imageConfig(checkTemplate.type);

  const croppedEyesImage = await cropImageToBase64(eyesImage.base_64, imageAxis.eyes);
  const croppedNoseImage = await cropImageToBase64(noseImage.base_64, imageAxis.nose);
  const croppedMouthImage = await cropImageToBase64(mouthImage.base_64, imageAxis.mouth);

  console.log(checkTemplate.type, imageAxis.eyes);
  console.log(imageAxis.nose);
  console.log(imageAxis.mouth);

  const finalConfig = [{
      image: croppedEyesImage,
      others: imageAxis.eyes
    },
    {
      image: croppedNoseImage,
      others: imageAxis.nose
    },
    {
      image: croppedMouthImage,
      others: imageAxis.mouth
    },
  ]

  const getImage = await generateImage(checkTemplate.url, finalConfig, type=human_or_robot);

  const slider_info = await logRepository.checkSlider(data);

  var image_base64 = "";
  var image_id = ""

  if(!slider_info)
  {

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
    image_base64: getImage
  };
 
};

const generateImage = async (baseImage, overlays, type, outputFormat = 'png', featherSize=20) => {

  try {

    const getConvertedTemplate = await helpers.convertImageToBase64(baseImage);

    const buffer = Buffer.from(getConvertedTemplate.data, 'binary').toString('base64');
    const base64Data = buffer.replace(/^data:image\/\w+;base64,/, '');
    const baseImageBuffer = Buffer.from(base64Data, 'base64');

    let image = sharp(baseImageBuffer);

    const compositeInputs = [];
    
    for (const overlay of overlays) {
      
      var overlayBuffer = Buffer.from(overlay.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

      var featheredOverlayBuffer = "";

      if(type == "robot")
      {
         featheredOverlayBuffer = await featherOverlayRobot(overlayBuffer, featherSize);
      }
      else if(type == "human")
      {
         featheredOverlayBuffer = await featherOverlay(overlayBuffer, featherSize);
      }
  
      // Each overlay object for composite:
      compositeInputs.push({
        input: featheredOverlayBuffer,
        left: overlay.others.x,
        top: overlay.others.y
      });

      console.log(compositeInputs);
    }

    const outputBuffer = await image
    .composite(compositeInputs)
    [outputFormat]()
    .toBuffer();

  // Convert to base64
  const base64Output = outputBuffer.toString('base64');
  return base64Output;
    
    } catch (error) {
      console.error('Error processing images:', error);
      throw error;
    }

};

async function featherOverlay(overlayBuffer, featherSize = 20) {
  const { width, height } = await sharp(overlayBuffer).metadata();
  const mask = await createFeatherMask(width, height, featherSize);

  const featheredOverlay = await sharp(overlayBuffer)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png() // Ensuring we keep alpha
    .toBuffer();

  return featheredOverlay;
}

async function featherOverlayRobot(overlayBuffer, featherSize = 20) {
  const { width, height } = await sharp(overlayBuffer).metadata();
  const mask = await createFeatherMaskRobot(width, height, featherSize);

  const featheredOverlay = await sharp(overlayBuffer)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png() // Ensuring we keep alpha
    .toBuffer();

  return featheredOverlay;
}

async function createFeatherMask(width, height, featherSize = 20) {
  // Create a solid black background (for the full area)
  const blackBuffer = await sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).png().toBuffer();

  // Create a smaller white rectangle inside
  const whiteWidth = width - featherSize * 2;
  const whiteHeight = height - featherSize * 2;
  if (whiteWidth <= 0 || whiteHeight <= 0) {
    throw new Error('Feather size too large for the overlay dimensions.');
  }

  const whiteBuffer = await sharp({
    create: {
      width: whiteWidth,
      height: whiteHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  }).png().toBuffer();

  // Composite the white rectangle onto the black background
  let mask = await sharp(blackBuffer)
    .composite([{
      input: whiteBuffer,
      left: featherSize,
      top: featherSize
    }])
    .png()
    .toBuffer();

  // Now blur the mask to create a gradient from white to black
  mask = await sharp(mask)
    .blur(featherSize) // Feather amount controls the softness
    // .toColourspace('b-w') // Make it a single-channel grayscale mask
    .png()
    .toBuffer();

  return mask;
}

async function createFeatherMaskRobot(width, height, featherSize = 20) {
  // Create a solid black background (for the full area)
  const blackBuffer = await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  }).png().toBuffer();

  // Create a smaller white rectangle inside
  const whiteWidth = width - featherSize * 2;
  const whiteHeight = height - featherSize * 2;
  if (whiteWidth <= 0 || whiteHeight <= 0) {
    throw new Error('Feather size too large for the overlay dimensions.');
  }

  const whiteBuffer = await sharp({
    create: {
      width: whiteWidth,
      height: whiteHeight,
      channels: 3,
      background: { r: 255, g: 255, b: 255}
    }
  }).png().toBuffer();

  // Composite the white rectangle onto the black background
  let mask = await sharp(blackBuffer)
    .composite([{
      input: whiteBuffer,
      left: featherSize,
      top: featherSize
    }])
    .png()
    .toBuffer();

  // Now blur the mask to create a gradient from white to black
  mask = await sharp(mask)
    .blur(featherSize) // Feather amount controls the softness
    // .toColourspace('b-w') // Make it a single-channel grayscale mask
    .png()
    .toBuffer();

  return mask;
}

const cropImageToBase64 = async (input, axis, format = 'png') => {
  try {
    // Perform the crop using Sharp

    const baseFile = Buffer.from(input, 'base64');

    console.log(await sharp(baseFile).metadata());

    const croppedBuffer = await sharp(baseFile)
      .extract({ left: axis.x, top: axis.y, width: axis.h, height: axis.w }) // define the crop region
      [format]() // optionally set the output format
      .toBuffer();

    // Convert the buffer to a base64 string
    const base64Image = croppedBuffer.toString('base64');

    // Construct a data URI
    const mimeType = `image/${format}`;
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    return base64Image;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
}

const cropEyes = async (faceType, layerImage, x, y) => {

};

const cropNose = async (faceType, layerImage, x, y) => {

};

const cropMouth = async (faceType, layerImage, x, y) => {

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

//addCrop
const addCrop = async (req, res, next) => {

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

  const {template_id, human_or_robot, eyes, nose, mouth, x, y, h, w} = req.body;
  const data = {template_id, human_or_robot, eyes, nose, mouth, x, y, h, w};

  await logRepository.addCroppedImages(data);

  return;

};

module.exports = {
  createImage,
  getInfos,
  feedback,
  setFavorite,
  addTemplate,
  allTemplates,
  allFavorites,
  addCrop
};