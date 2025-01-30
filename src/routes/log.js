const express = require('express');
const router = express.Router();
const multer = require('multer');
const LogController = require('../controllers/LogController');
const passport = require('passport');
require('../config/passport');

var jwtMiddleWare = passport.authenticate('jwt', {session: false});
const logMiddleware = require('../middleware/decodeJwt').authMiddleware;
const verifyToken = require('../middleware/decodeJwt').verifyToken;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



//logs
router.post('/generate', [jwtMiddleWare, verifyToken], LogController.createEvent);
router.post('/feedback/:slider_id', [jwtMiddleWare, verifyToken], LogController.feedback);
router.post('/favorite/:slider_id', [jwtMiddleWare, verifyToken], LogController.setFavorite);
router.get('/list', [jwtMiddleWare, verifyToken], LogController.getInfos);
router.post('/templates/add', LogController.addTemplate);
router.get('/templates', LogController.allTemplates);
router.get('/templates/:t_id', LogController.singleTemplate);
router.get('/favorites', [jwtMiddleWare, verifyToken], LogController.allFavorites);
router.post('/add-crop', LogController.addCrop);

router.get('/collections', LogController.allCollections);
router.get('/logs', [logMiddleware], LogController.interactionLogs);
router.get('/preference/logs', [logMiddleware], LogController.favLogs);
router.get('/feedback/logs', [logMiddleware], LogController.feedbackLogs);

router.post('/save', [upload.single('file')], LogController.saveConfig);



module.exports = router;   