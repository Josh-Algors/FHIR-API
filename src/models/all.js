const mongoose = require('mongoose');
const db = mongoose.connection.db;

const logSchema = new mongoose.Schema({
    user_id: String,
    slider_id: String
},
{
    collection: 'Logs',
    timestamps: true
});

const Log = mongoose.model('Logs', logSchema);

module.exports = { Log };

