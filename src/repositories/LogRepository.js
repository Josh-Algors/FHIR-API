const mongoose = require('mongoose');
const dbs = mongoose.connection.db;

const { Symptom } = require("../models/symptom");


 //logSymptoms
 const logSymptoms = async (data) => {

    await Symptom.create({
        user_id: data.user_id,
        symptoms: data.symptoms
    });

    return;

 }

 //allSymptoms
 const allSymptoms = async (data) => {

    const info = await Symptoms.find({
        user_id: data.user_id
    }).populate({path: 'user_id'}).exec();

    return info;

 }

module.exports = {
    logSymptoms,
    allSymptoms
}