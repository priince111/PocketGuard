const {Router} = require('express')
const transactionController = require('../controllers/transactionController');
const router = Router();
const authenticate = require('../middlewares/auth');

router.post('/addTransaction',authenticate,transactionController.addTransaction);
router.get('/getTransaction',authenticate,transactionController.getTransaction);
router.delete('/deleteTransaction/:id',authenticate,transactionController.deleteTransaction);
router.put('/updateTransaction/:id',authenticate,transactionController.updateTransaction);

module.exports = router;