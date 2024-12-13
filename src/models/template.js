const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    url: String,
    mask_url: String,
    type: String,
    status: Number
},
{
    collection: 'Templates',
    timestamps: true
});

const Template = mongoose.model('Templates', templateSchema);

module.exports = { Template };
