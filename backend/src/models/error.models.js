export class ResponseError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors || [message];
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errors = Array.isArray(err.errors)
        ? err.errors
        : [err.message || 'Internal Server Error'];
    
    console.error(`Error [${statusCode}]:`, err.message, errors, "Stack:", err.stack, "\n ENV:", process.env.NODE_ENV);

    res.status(statusCode).json({
        success: false,
        message: errors.length === 0 ? err.message : "Terjadi beberapa kesalahan.",
        errors: errors,
        err
    });
    // Jangan panggil next() di sini!
}

export const BadRequestError = (message, errors = []) => {
    
}