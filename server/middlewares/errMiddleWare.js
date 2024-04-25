const errMiddleware = (err, req, res, next) => {
    const errStatus = res.statusCode ? res.statusCode:500;
    res.json(errStatus, {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
};

export default errMiddleware;