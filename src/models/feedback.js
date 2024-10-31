const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    id: Number,
    user_id: String,
    slider_id: String,
    is_human: String,
    feedback: String
},
{
    collection: 'Feedbacks',
    timestamps: true
});

const Feedback = mongoose.model('Feedbacks', feedbackSchema);

module.exports = { Feedback };
