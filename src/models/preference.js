const mongoose = require('mongoose');

const preferredLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    slider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Images',
    },
    rating: Number
},
{
    collection: 'Preferences',
    timestamps: true
});

preferredLogSchema.virtual('Images', {
    ref: 'Images',
    localField: '_id',
    foreignField: 'slider_id',
    justOne: true
});

const Preference = mongoose.model('Preferences', preferredLogSchema);

module.exports = { Preference };