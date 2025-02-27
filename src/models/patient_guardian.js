const mongoose = require('mongoose');

const patientGuardianSchema = new mongoose.Schema({
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    guardian_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }
},
{
    collection: 'Patient_Guardian',
    timestamps: true
});


patientGuardianSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'doctor_id',
    justOne: true
});


patientGuardianSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'patient_id',
    justOne: true
});


patientGuardianSchema.virtual('Users', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'guardian_id',
    justOne: true
});

const PatientToGuardian = mongoose.model('Patient_Guardian', patientGuardianSchema);

module.exports = { PatientToGuardian };
