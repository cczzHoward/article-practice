const cors = require('cors');

const corsMiddleware = cors({
    origin: '*', // 允許所有來源
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 允許的 HTTP 方法
    credentials: true, // 允許攜帶 Cookie
});

module.exports = corsMiddleware;
