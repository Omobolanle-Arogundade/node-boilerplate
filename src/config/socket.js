const socketio = require('socket.io');
const logger = require('./logger');

let io;
let socket;

/**
 * @class Event
 */
class Socket {
 /**
  *
  * @param {*} server
  * @returns {*} socket instance
  */
 constructor() {
  this.io = io;
  this.socket = socket;
 }

 /**
  *
  * @param {*} server
  * @returns {*} socket instance
  */
 get socketIO() {
  return {
   io: this.io,
   socket: this.socket,
  };
 }

 /**
  *
  * @param {*} server
  * @returns {*} socket instance
  */
 init(server) {
  io = socketio(server);
  this.io = io;
  return this.io;
 }

 /**
  *
  * @param {*} server
  * @returns {*} socket instance
  */
 connection() {
  const that = this;

  logger.info('Connected to socket');

  io.on('connection', function (socketInstance) {
   that.socket = socketInstance;
   socket = socketInstance;

   /* Functions to listen and emit events after client create a new request
    */
  });
 }
}

module.exports = new Socket();
