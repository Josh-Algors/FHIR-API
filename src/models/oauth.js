const mongoose = require('mongoose');

const oauthSchema = new mongoose.Schema({
    email: String,
    iat: Number,
    exp: Number
});

const Oauth = mongoose.model('Oauths', oauthSchema);

module.exports = { Oauth };