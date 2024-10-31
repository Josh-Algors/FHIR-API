const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    email: String
},
{
    collection: 'Users',
    timestamps: true
});

const User = mongoose.model('Users', userSchema);

module.exports = { User };
