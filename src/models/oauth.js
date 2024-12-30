const mongoose = require('mongoose');

const oauthSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    email: String,
    iat: Number,
    exp: Number
});

const Oauth = mongoose.model('Oauths', oauthSchema);

module.exports = { Oauth };