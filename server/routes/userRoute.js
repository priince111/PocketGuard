const {Router} = require('express')
const userController = require('../controllers/userController');
const router = Router();

router.post('/signup',userController.signup);
router.post('/signin',userController.signin);
router.get('/user',userController.get_user);

module.exports = router;