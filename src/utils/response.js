function success(res, data = null, message = 'success', code = 200) {
    return res.status(code).json({ success: true, message, data });
}

function created(res, data = null, message = 'created', code = 201) {
    return res.status(code).json({ success: true, message, data });
}

function noContent(res, message = 'no content') {
    return res.status(204).send();
}

function badRequest(res, message = 'bad request', data = null) {
    return res.status(400).json({ success: false, message, data });
}

function unauthorized(res, message = 'unauthorized', data = null) {
    return res.status(401).json({ success: false, message, data });
}

function forbidden(res, message = 'forbidden', data = null) {
    return res.status(403).json({ success: false, message, data });
}

function notFound(res, message = 'not found', data = null) {
    return res.status(404).json({ success: false, message, data });
}

function conflict(res, message = 'conflict', data = null) {
    return res.status(409).json({ success: false, message, data });
}

function error(res, message = 'error', code = 500, data = null) {
    return res.status(code).json({ success: false, message, data });
}

module.exports = { 
    success,
    created,
    noContent,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    conflict,
    error
};