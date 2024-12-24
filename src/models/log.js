const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    slider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Images',
    },
},
{
    collection: 'Logs',
    timestamps: true
});

logSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
});

logSchema.virtual('Images', {
    ref: 'Images',
    localField: 'template_id',
    foreignField: 'slider_id',
    justOne: false
});

const Log = mongoose.model('Logs', logSchema);

module.exports = { Log };