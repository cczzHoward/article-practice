function success(res, data = null, message = 'success', code = 200) {
    return res.status(code).json({ success: true, message, data });
}

function error(res, message = 'error', code = 500, data = null) {
    return res.status(code).json({ success: false, message, data });
}

module.exports = { 
    success, error 
};