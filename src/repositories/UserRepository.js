require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require("../models/user");
const { DoctorToPatient } = require("../models/doctor_patient");
const { PatientToGuardian } = require("../models/patient_guardian");

const ENV = process.env;
const salt = bcrypt.genSaltSync(Number(ENV.SALT_ROUNDS));


const createUser = async (data) => {

    const info = await User.create({
        username: data.username,
        email: data.email,
        type: data.type,
        password: bcrypt.hashSync(data.password, salt)
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

const checkEmailorUsernameorType = async (data) => {

    const info = await User.findOne({ 
        $or: [{ email: data.email }, { username: data.username }],
        $and: [{ type: data.type }]
    });

    return info;
};

//allDoctors
const allUsersByType = async (type) => {

    var info = await User.find({type}).select('-password');

    return info;
};

//checkDoctor
const checkDoctor = async (data) => {

    var info = await User.find({_id: data.doctor_id, type: "doctor"});

    return info;
};

//assignDoctor
const assignDoctor = async (data) => {

    var info = await DoctorToPatient.create({
        patient_id: data.patient_id,
        doctor_id: data.doctor_id
    });

    return info;
};

const assignCaregiver = async (data) => {

    var info = await PatientToGuardian.create({
        patient_id: data.patient_id,
        guardian_id: data.guardian_id,
        doctor_id: data.doctor_id
    });

    return info;
};

// checkAssigned
const checkAssigned = async (data) => {

    var info = await DoctorToPatient.findOne({
        patient_id: data.patient_id
    }).populate({path: 'patient_id'}).exec();

    return info;
};

//assignedPatientsToDoctor
const assignedPatientsToDoctor = async (doctor_id) => {

    var info = await DoctorToPatient.find({
        doctor_id: doctor_id
    }).populate({path: 'patient_id', select: '-password'}).exec();

    return info;
};

//checkAssignedGuardian
const checkAssignedGuardian = async (data) => {

    var info = await PatientToGuardian.findOne({
        guardian_id: data.guardian_id,
        patient_id: data.patient_id
    });

    return info;
};

//assignedPatientsToGuardian
const assignedPatientsToGuardian = async (guardian_id) => {

    var info = await PatientToGuardian.find({
        guardian_id: guardian_id,
    }).populate({path : 'doctor_id', select: '-password'})
    .populate({path : 'patient_id', select: '-password'}).exec();

    return info;
};

//checkGuardian
const checkGuardian = async (guardian_id) => {

    var info = await User.find({
        _id: guardian_id,
    });

    return info;
};

//checkPatient
const checkPatient = async (patient_id) => {

    var info = await User.find({
        _id: patient_id,
    });

    return info;
};


module.exports = {
    createUser,
    findOrCreate,
    checkEmailorUsernameorType,
    allUsersByType,
    checkDoctor,
    assignDoctor,
    checkAssigned,
    assignedPatientsToDoctor,
    checkAssignedGuardian,
    assignedPatientsToGuardian,
    checkGuardian,
    checkPatient,
    assignCaregiver
}