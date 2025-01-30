const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    slider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Images',
    },
    is_human: String,
    feedback: String
},
{
    collection: 'Feedbacks',
    timestamps: true
});

feedbackSchema.virtual('Images', {
    ref: 'Images',
    localField: '_id',
    foreignField: 'slider_id',
    justOne: true
});

const Feedback = mongoose.model('Feedbacks', feedbackSchema);

module.exports = { Feedback };