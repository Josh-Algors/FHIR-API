const express = require('express');
const router = express.Router();
const multer = require('multer');
const LogController = require('../controllers/LogController');
const cacheLogger = require('../middleware/cacheLogger').cacheMiddleware;
const passport = require('passport');
require('../config/passport');

var jwtMiddleWare = passport.authenticate('jwt', {session: false});
const logMiddleware = require('../middleware/decodeJwt').authMiddleware;
const verifyToken = require('../middleware/decodeJwt').verifyToken;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// //logs
//patients
router.get('/patients', [jwtMiddleWare, verifyToken, cacheLogger], LogController.getPatients);
router.post('/treatment', [jwtMiddleWare, verifyToken], LogController.getTreatment);
router.post('/assign-doctor', [jwtMiddleWare, verifyToken], LogController.assignDoctor);

//guardians
router.get('/guardians', [jwtMiddleWare, verifyToken, cacheLogger], LogController.getGuardians);
router.get('/assigned-patients', [jwtMiddleWare, verifyToken], LogController.getAllAssignedPatients);

//doctors
router.get('/all-symptoms', [jwtMiddleWare, verifyToken], LogController.allSymptomsOfAssignedPatients);
router.post('/assign-guardian', [jwtMiddleWare, verifyToken], LogController.assignCaregiver);
router.get('/doctors', [jwtMiddleWare, verifyToken], LogController.getDoctors);
router.post('/prescriptions', [jwtMiddleWare, verifyToken], LogController.prescriptions);
router.get('/assigned-patients-doctor', [jwtMiddleWare, verifyToken], LogController.getAllAssignedPatientsFromDoctor);



module.exports = router;   