const mongoose = require('mongoose');

const doctorPatientSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
},
{
    collection: 'Doctor_Patient',
    timestamps: true
});

doctorPatientSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'patient_id',
    justOne: true
});

doctorPatientSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'doctor_id',
    justOne: true
});

const DoctorToPatient = mongoose.model('Doctor_Patient', doctorPatientSchema);

module.exports = { DoctorToPatient };
