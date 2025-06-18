const logger = require('../utils/logger');

const errorHandler = (err, res) => {
    logger.error(`${err.status || 500} - ${err.message}`);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            type: 'ValidationError',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).json({
            type: 'DuplicateKey',
            message: 'Duplicate field value detected'
        });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;