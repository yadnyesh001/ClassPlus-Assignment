const router = require('express').Router();
const { authRequired } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

router.get('/me', authRequired, ctrl.me);
router.put('/me', authRequired, ctrl.updateMe);

module.exports = router;
