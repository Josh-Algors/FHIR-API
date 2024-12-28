const mongoose = require('mongoose');

const oauthSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    email: String,
    iat: Number,
    exp: Number
});

oauthSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
});

const Oauth = mongoose.model('Oauths', oauthSchema);

module.exports = { Oauth };