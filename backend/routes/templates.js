const router = require('express').Router();
const ctrl = require('../controllers/templateController');

router.get('/', ctrl.list);
router.get('/categories', ctrl.categories);
router.get('/:id', ctrl.getOne);

module.exports = router;
