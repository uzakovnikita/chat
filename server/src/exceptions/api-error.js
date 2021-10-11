class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        console.log('UnauthorizedError');
        return new ApiError(401, 'Пользователь не авторизован', )
    }

    static BadRequest(message, errors = []) {
        console.log('BadRequest');
        return new ApiError(400, message, errors)
    }
}
module.exports = ApiError;