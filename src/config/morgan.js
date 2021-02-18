const morgan = require('morgan');
const config = require('.');
const logger = require('./logger');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - :remote-user [:date[clf]] - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - timestamp :date[clf]`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message - timestamp :date[clf]`;

const successHandler = morgan(successResponseFormat, {
 skip: (req, res) => res.statusCode >= 400,
 stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
 skip: (req, res) => res.statusCode < 400,
 stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
 successHandler,
 errorHandler,
};
