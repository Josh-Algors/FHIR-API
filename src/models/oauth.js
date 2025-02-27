const mongoose = require('mongoose');

const oauthSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    email: String,
    type: {
        type: String,
        enum : ['doctor','patient', 'guardian']
    },
    iat: Number,
    exp: Number
});

const Oauth = mongoose.model('Oauths', oauthSchema);

module.exports = { Oauth };