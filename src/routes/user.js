const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const validate = require('../validators/validate');
const CommonValidator = require('../validators/common');
const passportMiddleware = require('../middlewares/passport');
const { isUserSelfOrAdminButNotSelf } = require('../middlewares/auth');

router.use(passportMiddleware.authenticate('jwt', { session: false }));

// 刪除用戶
router.delete(
    '/:id',
    validate(CommonValidator.objectIdSchema, 'params'),
    isUserSelfOrAdminButNotSelf,
    UserController.delete
);

module.exports = router;
