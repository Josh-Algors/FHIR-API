const mongoose = require('mongoose');
const dbs = mongoose.connection.db;

const { Feedback } = require("../models/feedback");
const { Preference } = require("../models/preference");
const { Image } = require("../models/images");
const { Log } = require("../models/log");
const { Template } = require("../models/template");
const { Cropped } = require("../models/cropped");



//logFeedback
const logFeedback = async (data) => {

    await Feedback.create({
        user_id: data.user_id,
        slider_id: data.slider_id,
        is_human: data.isHuman,
        feedback: data.feedback
    });

    return;
};

//logFavorite
const logFavorite = async (data) => {

    await Preference.create({
        user_id: data.user_id,
        slider_id: data.slider_id,
        rating: data.rating
    });

    return;
};

const updateFavorite = async (data) => {

    await Preference.updateOne({
        user_id: data.user_id
    },
    {$set: {slider_id: data.slider_id}});

    return;
};

const checkFavorite = async (data) => {

   const info = await Preference.findOne({
        user_id: data.user_id
    });

    return info;
};

//checkSlider
const checkSlider = async (data) => {

    const info = await Image.findOne({
         human_or_robot: data.human_or_robot,
         eyes: data.eyes,
         nose: data.nose,
         mouth: data.mouth
     });
 
     return info;
 };

 //logSlider
 const logSlider = async (data, image) => {

    const info = await Image.create({
         template_id: data.template_id,  
         human_or_robot: data.human_or_robot,
         eyes: data.eyes,
         nose: data.nose,
         mouth: data.mouth,
         base_64: image
     });
 
     return info;
 };

 //getSlider
 const getSlider = async (id) => {

    const info = await Image.findOne({
        _id: id,
     });
 
     return info;
 };

 //logUserSlider
 const logUserSlider = async (data) => {

    const info = await Log.create({
         user_id: data.user_id,
         slider_id: data.slider_id,
         template_id: data.template_id
     });
 
     return info;
 };

 //checkTemplate
 const checkTemplate = async (image_url) => {

    const info = await Template.findOne({
         url: image_url,
     });
 
     return info;
 };

 //checkTemplateById
 const checkTemplateById = async (id) => {

    const info = await Template.findOne({
         _id: id,
     });
 
     return info;
 };

 //addTemplate
 const addTemplate = async (image_url, mask_url) => {

    const info = await Template.create({
         url: image_url,
         mask_url: mask_url
     });
 
     return info;
 };

 //allTemplates
 const allTemplates = async () => {

    const info = await Template.find();
 
     return info;
 };

 //favorites
 const favorites = async (user_id) => {
console.log(user_id);
    const info = await Preference.find({
         user_id: user_id
     });
 
     return info;
 };
 
 const addCroppedImages = async (data) => {

    const info = await Cropped.create({
         template_id: data.template_id,
         eyes: data.eyes,
         nose: data.nose,
         mouth: data.mouth,
         base_64: data.base_64,
         x: data.x,
         y: data.y,
         h: data.h,
         w: data.w
     });
 
     return info;
 };

 const getEyes = async (template_id, eyes) => {

    const info = await Cropped.findOne({
         template_id: template_id,
         eyes: eyes
     });

    if(!info)
    {
        const info = await Cropped.findOne({
            template_id: template_id,
            eyes: "base-image"
        });

        return info;
    }
 
     return info;
 };

 const getNose = async (template_id, nose) => {

    const info = await Cropped.findOne({
         template_id: template_id,
         nose: nose,
     });

    if(!info)
    {
        const info = await Cropped.findOne({
            template_id: template_id,
            nose: "base-image"
        });

        return info;
    }
 
     return info;
 };

 const getMouth = async (template_id, mouth) => {

    const info = await Cropped.findOne({
         template_id: template_id,
         mouth: mouth
     });

    if(!info)
    {
        const info = await Cropped.findOne({
            template_id: template_id,
            mouth: "base-image"
        });

        return info;
    }
 
     return info;
 };

 //singleTemplate
 const singleTemplate = async (template_id) => {

    const info = await Cropped.find({
         template_id: template_id
     }).select(['eyes', 'nose', 'mouth']);
 
     return info;
 };

 const allCollections = async (col_name) => {

    const collections = await mongoose.connection.db.listCollections().toArray();

    // return collections;

    for (col of collections)
    {
        const docs = await mongoose.connection.db.collection(col_name).find({}).toArray();

        return docs;
    }

 };

 const allLogs = async () => {

    const info = await Log.find().populate('user_id')
                    .populate({path: 'slider_id', select: '-base_64'});

    return info;
 }

//  findTemplate

const findTemplate = async (template_id) => {

    const info = await Template.findOne({
        _id: template_id
    });

    return info;
 }

 //preferenceLogs
 const preferenceLogs = async () => {

    const info = await Preference.find().populate('user_id').populate({
        path: 'slider_id',
        select: ['-base_64']
    });

    return info;
 }

 //feedbackLogs
 const feedbackLogs = async () => {

    const info = await Feedback.find().populate('user_id').populate({
        path: 'slider_id',
        select: ['-base_64']
    });

    return info;
 }

module.exports = {
    logFeedback,
    logFavorite,
    checkFavorite,
    updateFavorite,
    checkSlider,
    logSlider,
    logUserSlider,
    checkTemplate,
    addTemplate,
    allTemplates,
    favorites,
    getSlider,
    checkTemplateById,
    addCroppedImages,
    getEyes,
    getNose,
    getMouth,
    allCollections,
    allLogs,
    findTemplate,
    preferenceLogs,
    feedbackLogs,
    singleTemplate
}