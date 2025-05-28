const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');

// 用戶註冊
router.post('/register',
    AuthController.register,
);

// 用戶登入
router.post('/login', 
    AuthController.login,
);

// 用戶登出
router.post('/logout', async (req, res) => {});

module.exports = router;