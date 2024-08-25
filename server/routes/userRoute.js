const {Router} = require('express')
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const router = Router();

router.post('/signup',userController.signup);
router.post('/signin',userController.signin);
router.post('/guest-login',userController.guest_login);
router.delete('/logout',authenticate, userController.deleteGuestUser);
router.get('/user',userController.get_user);

module.exports = router;