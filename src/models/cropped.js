const mongoose = require('mongoose');

const croppedSchema = new mongoose.Schema({
    id: Number,
    template_id: String,
    base_64: String,
    eyes: String,
    nose: String,
    mouth: String,
    x: Number,
    y: Number,
    h: Number,
    w: Number
},
{
    collection: 'Cropped_Images',
    timestamps: true
});

const Cropped = mongoose.model('Cropped_Images', croppedSchema);

module.exports = { Cropped };
