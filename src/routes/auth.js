const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');

// 用戶註冊
router.post('/register', async (req, res) => {
    AuthController.register(req, res)
});

// 用戶登入
router.post('/login', async (req, res) => {
    AuthController.login(req, res)
});

// 用戶登出
router.post('/logout', async (req, res) => {});

module.exports = router;