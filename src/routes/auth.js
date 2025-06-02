const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const passportMiddleware = require('../middlewares/passport');
const validate = require('../validators/validate');
const AuthValidator = require('../validators/auth');

// 用戶註冊
router.post('/register',
    validate(AuthValidator.registerSchema),
    AuthController.register,
);

// 用戶登入
router.post('/login', 
    validate(AuthValidator.loginSchema),
    AuthController.login,
);

// 以下路由需要身份驗證
router.use(passportMiddleware.authenticate('jwt', { session: false }));

// 變更帳密
router.post('/change-password',
    validate(AuthValidator.changePasswordSchema),
    AuthController.changePassword,  
);

// 用戶登出
// router.post('/logout', async (req, res) => {});

module.exports = router;