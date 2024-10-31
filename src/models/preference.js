const mongoose = require('mongoose');

const preferredLogSchema = new mongoose.Schema({
    user_id: String,
    slider_id: String,
    rating: Number
},
{
    collection: 'Preferences',
    timestamps: true
});

const Preference = mongoose.model('Preferences', preferredLogSchema);

module.exports = { Preference };