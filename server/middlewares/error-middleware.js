const ApiError = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
    }
    console.log('500')
    return res.status(500).json({message: 'Server request with failed', error: err})
};
