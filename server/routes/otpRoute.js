const {Router} = require('express')
const otpController = require('../controllers/otpController');
const router = Router();

router.post('/sendOTP',otpController.sendOTP);

module.exports = router;