const express = require('express');
const router = express.Router();
const LogController = require('../controllers/LogController');
const passport = require('passport');
require('../config/passport');

var jwtMiddleWare = passport.authenticate('jwt', {session: false});


//logs
router.post('/generate', [jwtMiddleWare], LogController.createEvent);
router.post('/feedback/:slider_id', [jwtMiddleWare], LogController.feedback);
router.post('/favorite/:slider_id', [jwtMiddleWare], LogController.setFavorite);
router.get('/list', [jwtMiddleWare], LogController.getInfos);
router.post('/templates/add', LogController.addTemplate);
router.get('/templates', LogController.allTemplates);
router.get('/favorites', [jwtMiddleWare], LogController.allFavorites);


module.exports = router;