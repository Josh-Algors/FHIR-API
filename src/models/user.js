const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    type: {
        type: String,
        enum : ['doctor','patient', 'guardian']
    },
    password: String,
},
{
    collection: 'Users',
    timestamps: true
});

const User = mongoose.model('Users', userSchema);

module.exports = { User };
