const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    id: Number,
    template_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Templates',
    },
    base_64: String,
    eyes: String,
    nose: String,
    mouth: String,
    human_or_robot: String
},
{
    collection: 'Images',
    timestamps: true
});

const Image = mongoose.model('Images', imageSchema);

module.exports = { Image };
