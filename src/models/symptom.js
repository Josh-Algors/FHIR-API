const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    symptoms: String
},
{
    collection: 'User_Symptoms',
    timestamps: true
});

symptomSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
});

const Symptom = mongoose.model('User_Symptoms', symptomSchema);

module.exports = { Symptom };
