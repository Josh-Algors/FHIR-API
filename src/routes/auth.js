const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

//signin
router.post('/login', AuthController.signIn);


module.exports = router;   



// const express = require('express');
// const app = express();
// const rateLimit = require('express-rate-limit');
// const UserController = require('../controllers/UserController');
// const UploadController = require('../controllers/UploadController');
// const router = express.Router();
// const multer = require('multer');
// const signatureSigner = require('../middleware/checkSignature').personalSignature;
// const passport = require('passport');
// const cacheMiddleware = require('../middleware/cacheMiddleware');
// const BudgetController = require('../controllers/BudgetController');
// const { sign } = require('jsonwebtoken');
// require('../config/passport');

// var dataGuard;

// var jwtMiddleWare = passport.authenticate('jwt', {session: false});

// if(process.env.APP != 'local')
// {
//     dataGuard = require('../middleware/decodeJWT').decodeMiddleware;
// }
// else
// {
//     dataGuard = (req, res, next) => {
//         next()
//     }
// }

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const limiter = rateLimit({
//     windowMs: 60000,
//     max: 2,
//     handler: (req, res) => {
//       return res.status(429).json({ 
//           status: 'ERROR',
//           code: 429,
//           message: 'Too many requests, please try again later.' 
//         });
//     },
// });

// app.use(limiter);


// //Budgets
// router.get('/all', [jwtMiddleWare, signatureSigner, dataGuard], BudgetController.allBudgets);
// router.get('/single/:id', [jwtMiddleWare, signatureSigner, dataGuard], BudgetController.singleBudget);
