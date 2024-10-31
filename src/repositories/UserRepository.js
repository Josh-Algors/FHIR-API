const { User } = require("../models/user");


const createUser = async (email) => {

    const info = await User.create({
        email: email
    });

    return info;
};

//checkEmail
const findOrCreate = async (email) => {

    var info = await User.findOne({email: email});

    if(!info)
    {
        info = await createUser(email);
    }

    return info;
};

module.exports = {
    createUser,
    findOrCreate
}