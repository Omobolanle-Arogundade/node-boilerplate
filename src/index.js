const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const socket = require('./config/socket');

let server;
mongoose
 .connect(config.mongoose.url, config.mongoose.options)
 .then(() => {
  logger.info('Connected to MongoDB');
 })
 .catch((err) => logger.error(`Error in mongoose connection ${err}`));

const port = config.port || '4000';

const httpServer = http.createServer(app);
const serverInstance = httpServer.listen(port);

const exitHandler = () => {
 if (server) {
  server.close(() => {
   logger.info('Server closed');
   process.exit(1);
  });
 } else {
  process.exit(1);
 }
};

const unexpectedErrorHandler = (error) => {
 logger.error(error);
 exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
 logger.info('SIGTERM received');
 if (server) {
  server.close();
 }
});

socket.init(serverInstance);
socket.connection();
